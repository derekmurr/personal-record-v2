import { gql } from "@apollo/client";

export const basicRun = gql`
  fragment basicRun on Run {
    id
    user {
      avatar
      fullName
      username
    }
    isBlocked
    title
    distance
    workoutType
    isCompleted
    start
  }
`;

export const fullRun = gql`
  fragment fullRun on Run {
    id
    user {
      avatar
      fullName
      username
    }
    createdAt
    isBlocked
    title
    distance
    start
    workoutType
    isCompleted
    duration
    tempInC
    weather
    treadmill
    notes
    effort
    rating
    racePosition
    raceFieldSize
    raceAgeGroupPosition
    raceAgeGroupFieldSize
    media
  }
`;

export const basicProfile = gql`
  fragment basicProfile on Profile {
    id
    avatar
    description
    fullName
    username
  }
`;

export const runsNextPage = gql`
  fragment runsNextPage on RunConnection {
    pageInfo {
      endCursor
      hasNextPage
    }
  }
`;

export const runsPrevPage = gql`
  fragment runsPrevPage on RunConnection {
    pageInfo {
      startCursor
      hasPrevPage
    }
  }
`;

export const profilesNextPage = gql`
  fragment profilesNextPage on ProfileConnection {
    pageInfo {
      endCursor
      hasNextPage
    }
  }
`;
