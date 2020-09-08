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
        keyArgs: ["filter", "startDate", "endDate"]
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
