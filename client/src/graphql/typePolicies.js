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
      runsByDateRange: {
        keyArgs: ["query"]
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
