import { DateTimeResolver } from "../../lib/customScalars";

const resolvers = {
  DateTime: DateTimeResolver,

  Profile: {
    runs(profile, args, { dataSources }, info) {
      return dataSources.runAPI.getOwnRuns(
        { ...args, userProfileId: profile.id },
        info
      );
    }
  },

  Run: {
    user(run, args, context, info) {
      return { __typename: "Profile", id: run.userProfileId };
    },
    id(run, args, context, info) {
      return run._id;
    },
    isBlocked(run, args, context, info) {
      return run.blocked;
    }
  },

  Query: {
    run(parent, { id }, { dataSources }, info) {
      return dataSources.runAPI.getRunById(id, info);
    },
    runs(parent, args, { dataSources }, info) {
      return dataSources.runsAPI.getRuns(args, info);
    },
    searchRuns(
      parent,
      { after, first, query: { text } },
      { dataSources },
      info
    ) {
      return dataSources.runAPI.searchRuns(
        { after, first, searchString: text },
        info
      );
    }
  },

  Mutation: {
    createRun(parent, { data }, { dataSources }, info) {
      return dataSources.runAPI.createRun(data);
    },
    deleteRun(parent, { where: { id } }, { dataSources }, info) {
      return dataSources.runAPI.deleteRun(id);
    },
    updateRun(parent, { where: { id } }, { dataSources }, info) {
      return dataSources.runAPI.updateRun(data);
    },
    toggleRunBlock(parent, { where: { id } }, { dataSources }, info) {
      return dataSources.runAPI.toggleRunBlock(id);
    }
  }
};

export default resolvers;
