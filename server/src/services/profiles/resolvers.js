import { UserInputError } from "apollo-server";

const resolvers = {
  // Resolve the profile field for the Account type that's extended
  // from the accounts service
  Account: {
    profile(account, args, { dataSources }, info) {
      return dataSources.profilesAPI.getProfile(
        { accountId: account.id },
        info
      );
    }
  },

  Profile: {
    __resolveReference(reference, { dataSources }, info) {
      return dataSources.profilesAPI.getProfileById(reference.id, info);
    },
    // Can't write this like a typical field resolver, as it has to point to
    // the account, which is outside this Profiles service. So we return a 
    // reference to the external Account type, setting the id property in the
    // returned object to accountId, because id is the key that connects the
    // Account to other types across service boundaries.
    account(profile, args, context, info) {
      return { __typename: "Account", id: profile.accountId };
    },
    id(profile, args, context, info) {
      return profile._id;
    }
  },

  Query: {
    async profile(parent, { username }, { dataSources }, info) {
      const profile = await dataSources.profilesAPI.getProfile(
        { username },
        info
      );
      // getProfile returns the value of Mongoose's findOne method, which
      // returns null if nothing is found, so we have to check for that and
      // throw an error, since the "profile" GraphQL query expects a
      // non-nullable Profile type to be returned.
      if (!profile) {
        throw new UserInputError("Profile does not exist.");
      }
      return profile;
    },

    profiles(parent, args, { dataSources }, info) {
      return dataSources.profilesAPI.getProfiles(args, info);
    },

    searchProfiles(
      parent,
      { after, first, query: { text } },
      { dataSources },
      info
    ) {
      return dataSources.profilesAPI.searchProfiles(
        { after, first, searchString: text },
        info
      );
    }
  },

  Mutation: {
    createProfile(parent, { data }, { dataSources }, info) {
      return dataSources.profilesAPI.createProfile(data);
    },

    updateProfile(
      parent,
      { data, where: { username: currentUsername } },
      { dataSources },
      info
    ) {
      return dataSources.profilesAPI.updateProfile(currentUsername, data);
    },

    deleteProfile(parent, { where: { username } }, { dataSources }, info) {
      return dataSources.profilesAPI.deleteProfile(username);
    }
  }
};

export default resolvers;
