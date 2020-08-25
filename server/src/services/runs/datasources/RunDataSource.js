import { DataSource } from "apollo-datasource";
import { UserInputError } from "apollo-server";

import { deleteUpload, uploadStream } from "../../../lib/handleUploads";
import getProjectionFields from "../../../lib/getProjectionFields";
import Pagination from "../../../lib/Pagination";

class RunDataSource extends DataSource {
  constructor({ Run, Profile }) {
    super();
    this.Run = Run;
    this.Profile = Profile;
    this.runPagination = new Pagination(Run);
  }

  async getRunById(id, info) {
    const projection = getProjectionFields(info, this.Run.schema);
    return this.Run.findById(id).select(projection);
  }

  async uploadMedia(media, profileId) {
    const buffer = Buffer.from(media.buffer.data);
    const uploadedMedia = await uploadStream(buffer, {
      folder: `${process.env.NODE_ENV}/${profileId}`,
      sign_url: true,
      type: "authenticated"
    }).catch(error => {
      throw new Error(`Failed to upload media. ${error.message}`);
    });
    return uploadedMedia.secure_url;
  }

  async getRuns(
    { after, before, first, last, orderBy, filter: rawFilter },
    info
  ) {
    let filter = {};
    // Parse the "raw" filter argument into something MongoDB can use.
    if (rawFilter && rawFilter.username) {
      // Because we only have a username to work with, we fetch the profile
      // first, and use its _id field to specify what user IDs we're searching 
      // for in the runs collection.
      const profile = await this.Profile.findOne({
        username: rawFilter.username
      }).exec();

      if (!profile) {
        throw new UserInputError("User with that username cannot be found.");
      }

      filter.userProfileId = {
        $in: [profile._id]
      };
    }

    if (rawFilter && rawFilter.includeBlocked === false) {
      filter.blocked = { $in: [null, false] };
    }

    // Parse the orderBy enum into something MongoDB can use
    const sort = this._getContentSort(orderBy);
    const queryArgs = { after, before, first, last, filter, sort };

    // Get the edges and page info
    const projection = getProjectionFields(info, this.Run.schema);
    const edges = await this.runPagination.getEdges(queryArgs, projection);
    const pageInfo = await this.runPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async getOwnRuns(
    { after, before, first, last, orderBy, userProfileId },
    info
  ) {
    const sort = this._getContentSort(orderBy);
    const filter = { userProfileId };
    const queryArgs = { after, before, first, last, filter, sort };
    const projection = getProjectionFields(info, this.Run.schema);
    const edges = await this.runPagination.getEdges(queryArgs, projection);
    const pageInfo = await this.runPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  _getContentSort(sortEnum) {
    // Helper to parse the sort field and direction for content.
    let sort = {};

    if (sortEnum) {
      const sortArgs = sortEnum.split("_");
      const [field, direction] = sortArgs;
      sort[field] = direction === "DESC" ? -1 : 1;
    } else {
      sort.createdAt = -1;
    }

    return sort;
  }

  async createRun({ media, username, ...rest }) {
    // Use the provided username to get the ID of the user's profile to set
    // as the userProfileId value.
    const profile = await this.Profile.findOne({ username });

    if (!profile) {
      throw new UserInputError("You must provide a valid username as owner of this run.");
    }

    let uploadedMediaUrl;
    if (media) {
      uploadedMediaUrl = await this.uploadMedia(media, profile._id);
    }

    const newRun = new this.Run({
      ...(uploadedMediaUrl && { media: uploadedMediaUrl }),
      userProfileId: profile.id,
      ...rest
    });

    return newRun.save();
  }

  async deleteRun(id) {
    const deletedRun = await this.Run.findByIdAndDelete(id).exec();
    const { media } = deletedRun;

    if (media) {
      await deleteUpload(media);
    }

    return deletedRun._id;
  }

  async updateRun(id, data) {
    return await this.Run.findOneAndUpdate(
      { _id: id },
      data,
      { new: true }
    );
  }

  async searchRuns({ after, first, searchString }, info) {
    const sort = { score: { $meta: "textScore" }, _id: -1 };
    const filter = {
      $text: { $search: searchString },
      blocked: { $in: [null, false] }
    };
    const queryArgs = { after, first, filter, sort };
    const projection = getProjectionFields(info, this.Run.schema);
    const edges = await this.runPagination.getEdges(queryArgs, projection);
    const pageInfo = await this.runPagination.getPageInfo(edges, queryArgs);

    return { edges, pageInfo };
  }

  async toggleRunBlock(id) {
    const run = await this.Run.findById(id).exec();
    const currentBlockedStatus =
      run.blocked === undefined ? false : run.blocked;

    return this.Run.findOneAndUpdate(
      { _id: id },
      { blocked: !currentBlockedStatus },
      { new: true }
    );
  }
}

export default RunDataSource;
