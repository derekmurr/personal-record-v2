import React from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";

import { useAuth } from "../../context/AuthContext";

const ProfileData = ({ profileData, refetchProfile }) => {
  const {
    account,
    avatar,
    description,
    fullName,
    id,
    username
  } = profileData;

  // Need access to AuthContext so we can render conditionally depending on
  // if the profile belongs to the currently logged-in user
  const value = useAuth();
  const {
    isModerator: viewerIsModerator,
    profile: { username: viewerUsername }
  } = value.viewerQuery.data.viewer;

  // Use React Router's useHistory hook so we have access to the history
  // object to push a route on button click
  const history = useHistory();

  return (
    <FlexContainer>
      <AvatarContainer>
        <img
          src={avatar}
          alt={`${fullName}'s avatar`}
        />
      </AvatarContainer>
      <div>
        {fullName && <h2>{fullName}</h2>}
        <h3>@{username}</h3>
        {account.isBlocked && <h4>This account has been temporarily suspended.</h4>}
        <p>{description ? description : "404: description not found."}</p>
        <p>Joined: {moment(account.createdAt).format("MMMM YYYY")}</p>

        <div>
          <button
            onClick={() => {
              history.push("/settings/profile");
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </FlexContainer>
  );
};

export default ProfileData;

const FlexContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const AvatarContainer = styled.div`
  width: 64px;
  height: 64px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 4rem;

  img {
    object-fit: cover;
  }
`;