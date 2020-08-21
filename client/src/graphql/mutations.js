import { gql } from "@apollo/client";

import { basicProfile } from "./fragments";

export const CHANGE_ACCOUNT_BLOCKED_STATUS = gql`
  mutation CHANGE_ACCOUNT_BLOCKED_STATUS(
    $where: AccountWhereUniqueInput!
  ) {
    changeAccountBlockedStatus(where: $where) {
      id
      isBlocked
    }
  }
`;

export const CHANGE_ACCOUNT_MODERATOR_ROLE = gql`
  mutation CHANGE_ACCOUNT_MODERATOR_ROLE(
    $where: AccountWhereUniqueInput!
  ) {
    changeAccountModeratorRole(where: $where) {
      id
      isModerator
    }
  }
`;

// Set up our named mutation to accept dynamic variables: anything passed
// in as $data must comform to the shape of the CreateProfileInput input 
// type defined in the server's schema. A successful createProfile mutation
// will send back information we'll use to update the Apollo Client cache
// with the most up-to-date viewer information.
export const CREATE_RUN = gql`
  mutation CREATE_RUN($data: CreateRunInput!) {
    createRun(data: $data) {
      id
    }
  }
`;

export const CREATE_PROFILE = gql`
  mutation CREATE_PROFILE($data: CreateProfileInput!) {
    createProfile(data: $data) {
      ...basicProfile
    }
  }
  ${basicProfile}
`;

export const DELETE_ACCOUNT = gql`
  mutation DELETE_ACCOUNT($where: AccountWhereUniqueInput!) {
    deleteAccount(where: $where)
  }
`;

export const DELETE_RUN = gql`
  mutation DELETE_RUN($where: RunWhereUniqueInput!) {
    deleteRun(where: $where)
  }
`;

export const TOGGLE_RUN_BLOCK = gql`
  mutation TOGGLE_RUN_BLOCK($where: RunWhereUniqueInput!) {
    toggleRunBlock(where: $where) {
      id
      isBlocked
    }
  }
`;

export const UPDATE_ACCOUNT = gql`
  mutation UPDATE_ACCOUNT(
    $data: UpdateAccountInput! 
    $where: AccountWhereUniqueInput! 
  ) {
    updateAccount(data: $data, where: $where) {
      id
    }
  }
`;

export const UPDATE_PROFILE = gql`
  mutation UPDATE_PROFILE(
    $data: UpdateProfileInput!
    $where: ProfileWhereUniqueInput!
  ) {
    updateProfile(data: $data, where: $where) {
      ...basicProfile
    }
  }
  ${basicProfile}
`;

export const UPDATE_RUN = gql`
  mutation UPDATE_RUN(
    $data: UpdateRunInput! 
    $where: RunWhereUniqueInput! 
  ) {
    updateRun(data: $data, where: $where) {
      id
    }
  }
`;
