import { gql } from "@apollo/client";

import {
  basicRun,
  basicProfile,
  fullRun,
  runsNextPage,
  profilesNextPage
} from "./fragments";

export const GET_RUN = gql`
  query GET_RUN($id: ID!) {
    run(id: $id) {
      ...fullRun
    }
  }
  ${fullRun}
`;

export const GET_RUNS = gql`
  query GET_RUNS($cursor: String, $filter: RunWhereInput) {
    runs(first: 30, after: $cursor, filter: $filter) {
      edges {
        node {
          ...basicRun
        }
      }
      ...runsNextPage
    }
  } 
  ${basicRun}
  ${runsNextPage}
`;

export const GET_RUNS_BY_DATE_RANGE = gql`
  query GET_RUNS_BY_DATE_RANGE(
      $cursor: String, 
      $filter: RunWhereInput,
      $startDate: DateTime!,
      $endDate: DateTime!
    ) {
    runsByDateRange(
      first: 100, 
      after: $cursor, 
      filter: $filter, 
      startDate: $startDate, 
      endDate: $endDate
    ) {
      edges {
        node {
          ...basicRun
        }
      }
      ...runsNextPage
    }
  } 
  ${basicRun}
  ${runsNextPage}
`;

export const GET_PROFILE = gql`
  query GET_PROFILE($username: String!) {
    profile(username: $username) {
      ...basicProfile
      account {
        id
        createdAt
        isBlocked
        isModerator
      }
    }
  }
  ${basicProfile}
`;

export const GET_PROFILE_CONTENT = gql`
  query GET_PROFILE_CONTENT(
    $runsCursor: String
    $username: String!
  ) {
    profile(username: $username) {
      ...basicProfile
      runs(first: 30, after: $runsCursor) {
        edges {
          node {
            ...basicRun
          }
        }
        ...runsNextPage
      }
    }
  }
  ${basicProfile}
  ${basicRun}
  ${runsNextPage}
`;

// The id fields are added both the main query and the sub-query 
// because Apollo Client normalizes data in the cache for faster 
// rendering based on an id field, if one exists, by default
export const GET_VIEWER = gql`
  query GET_VIEWER {
    viewer {
      id
      createdAt
      email
      isModerator
      profile {
        ...basicProfile
      }
    }
  }
  ${basicProfile}
`;

export const SEARCH_RUNS = gql`
  query SEARCH_RUNS($cursor: String, $query: RunSearchInput!) {
    searchRuns(first: 30, after: $cursor, query: $query) {
      edges {
        node {
          ...basicRun
        }
      }
      ...runsNextPage
    }
  }
  ${basicRun}
  ${runsNextPage}
`;

export const SEARCH_PROFILES = gql`
  query SEARCH_PROFILES($cursor: String, $query: ProfileSearchInput!) {
    searchProfiles(first: 30, after: $cursor, query: $query) {
      edges {
        node {
          ...basicProfile
        }
      }
      ...profilesNextPage
    }
  }
  ${basicProfile}
  ${profilesNextPage}
`;
