import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";
import DataLoader from "dataloader";
import gravatarUrl from "gravatar-url";

import { uploadStream } from "../../../lib/handleUploads";
import getProjectionFields from "../../../lib/getProjectionFields";
import Pagination from "../../../lib/Pagination";

class ProfilesDataSource extends DataSource {
  constructor({ auth0, Profile }) {
    super();
    this.auth0 = auth0;
    this.Profile = Profile;
    this.pagination = new Pagination(Profile);
  }

  // To batch our requests, we instantiate a new DataLoader object, whose 
  // constructor takes a batch function as an argument; the batch function 
  // has an "ids" parameter that represents the array of MongoDB document 
  // IDs corresponding to the profiles we want to retrieve. Inside the 
  // batch function, we use the find method (instead of findById) to
  // retrieve all the profile documents at once, then map over the original
  // ids array to return a new array containing all profile documents in 
  // the same order as the IDs that were passed into the function - 
  // maintaining the original order is required when using a DataLoader.
  _profileByIdLoader = new DataLoader(async keys => {
    const ids = [...new Set(keys.map(key => key.id))];
    const profiles = await this.Profile.find({ _id: { $in: ids } })
      .select(keys[0].projection)
      .exec();

    return keys.map(key =>
      profiles.find(profile => profile._id.toString() === key.id)
    );
  });

  // The initialize method is exposed by the parent DataSource class and
  // allows us to set config options for our child class. For our purposes,
  // we need access to the server's context object so we can use the 
  // decoded JWT from Auth0 to query the Management API for user account
  // data. This is so we can update the user's GitHub info.
  initialize(config) {
    this.context = config.context;
  }

  // This method passes a "query document" object into Mongoose's findOne
  // method; we've enforced uniqueness on the username paramater in the
  // Mongoose schema, so this will only return one profile per unique
  // username, if one exists. We chain an exec() method on the end so
  // Mongoose will return a Promise we can use with async/await.
  // It's a generalized "filter" because we can also use this to look up
  // by ID, so we can also resolve the profile field for the extended 
  // Account type – the Auth0 account ID is the only piece of data which
  // connects an Auth0 user account w its associated MongoDB profile document.
  getProfile(filter, info) {
    const projection = getProjectionFields(info, this.Profile.schema);
    return this.Profile.findOne(filter).select(projection);
  }

  async getProfiles({ after, before, first, last, orderBy }, info) {
    const sort = this._getProfileSort(orderBy);
    const queryArgs = { after, before, first, last, sort };
    const projection = getProjectionFields(info, this.Profile.schema);
    const edges = await this.pagination.getEdges(queryArgs, projection);
    const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);
    return { edges, pageInfo };
  }

  getProfileById(id, info) {
    const projection = getProjectionFields(info, this.Profile.schema);
    return this._profileByIdLoader.load(
      { id, projection },
      { cacheKeyFn: key => key.id }
    );
  }

  async createProfile(profile) {
    // Make sure we're creating a profile for an account that exists in Auth0
    const account = await this.auth0.getUser({ id: profile.accountId });

    // Use the email from Auth0 to grab the url for their 
    // profile pic from Gravatar 
    const avatar = gravatarUrl(account.email, { default: "mm" });
    profile.avatar = avatar;

    // Pass that profile to the Profile constructor method and save the result
    const newProfile = new this.Profile(profile);

    return newProfile.save();
  }

  // User's curent user name is always passed as the first argument, so we can
  // use it to find the correct user profile document to update in MongoDB.
  // The other args are optional, but we throw an error if none of those 
  // fields are included at all.
  async updateProfile(
    currentUsername,
    { avatar, description, fullName, username }
  ) {
    if (!avatar && !description && !fullName && !username) {
      throw new UserInputError("You must supply some profile data to update.");
    }

    let uploadedAvatar;

    if (avatar) {
      // If an avatar was included with the mutation, then fetch the user's
      // profile document from MongoDB, so we can use their id in the 
      // uploaded image's file path
      const { _id } = await this.Profile.findOne({
        username: currentUsername
      }).exec();

      if (!_id) {
        throw new UserInputError("User with that username cannot be found.");
      }

      // Create a new Buffer instance from the avatar buffer's data
      const buffer = Buffer.from(avatar.buffer.data);
      
      // pass it into our uploadStream function with our config options, 
      // and await a response from Cloudinary that it was successful. 
      // If success, include the secure_url from the response object 
      // with our data object we'll send to findOneAndUpdate.
      uploadedAvatar = await uploadStream(buffer, {
        folder: `${process.env.NODE_ENV}/${_id}`,
        format: "png",
        public_id: "avatar",
        sign_url: true,
        transformation: [
          { aspect_ratio: "1:1", crop: "crop" },
          { height: 400, width: 400, crop: "limit" }
        ],
        type: "authenticated"
      }).catch(error => {
        throw new Error(`Failed to upload profile picture. ${error.message}`);
      });
    }

    // Destructure only the information that was passed in and add it
    //  to the data object
    const data = {
      ...(uploadedAvatar && { avatar: uploadedAvatar.secure_url }),
      ...(description && { description }),
      ...(fullName && { fullName }),
      ...(username && { username })
    };

    // The first argument to findOneAndUpdate is an object containing the 
    // fields we need to find a matching document (here, the unique username)
    // The second arg is an object containing the fields we wish to update
    // By passing { new: true } as the final arg, this method returns
    // the updated object once the new fields are successfully saved.
    return this.Profile.findOneAndUpdate(
      { username: currentUsername },
      data,
      { new: true }
    );
  }

  async deleteProfile(username) {
    const deletedProfile = await this.Profile.findOneAndDelete({
      username
    }).exec();
    return deletedProfile._id;
  }

  _getProfileSort(sortEnum) {
    let sort = {};

    if (sortEnum) {
      const sortArgs = sortEnum.split("_");
      const [field, direction] = sortArgs;
      sort[field] = direction === "DESC" ? -1 : 1;
    } else {
      sort.username = 1;
    }

    return sort;
  }

  // The searchString may contain multiple words, so the $text query operator
  // tokenizes the string value of the $search field using whitespace and
  // punctuation as delimiters, then performs a logical OR on all the tokens;
  // that is, MongoDB searches the applicable fields to find instances of any
  // word in the search string. The second arg passes a projection so the
  // returned document includes the textScore, so we can sort on it based on
  // the relevance score MongoDB assigns the results. The secondary sort is
  // based on _id, which we'll need for cursor-based pagination.
  async searchProfiles({ after, first, searchString }, info) {
    const sort = { score: { $meta: "textScore" }, _id: -1 };
    const filter = { $text: { $search: searchString } };
    const queryArgs = { after, first, filter, sort };
    const projection = getProjectionFields(info, this.Profile.schema);
    const edges = await this.pagination.getEdges(queryArgs, projection);
    const pageInfo = await this.pagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }
}

export default ProfilesDataSource;
