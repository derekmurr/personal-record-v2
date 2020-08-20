export default {
  Profile: {
    fields: {
      runs: {
        keyArgs: []
      }
    }
  },
  Query: {
    fields: {
      runs: {
        keyArgs: ["filter"]
      },
      searchRuns: {
        keyArgs: ["query"]
      },
      searchProfiles: {
        keyArgs: ["query"]
      }
    }
  }
};
