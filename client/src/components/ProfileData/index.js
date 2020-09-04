import React from "react";
import { useHistory } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";

import { useAuth } from "../../context/AuthContext";
import { colors } from "../../styles";
import { BigButton } from "../../elements";

const ProfileData = ({ profileData, refetchProfile }) => {
  const {
    account,
    avatar,
    description,
    fullName,
    username
  } = profileData;

  // Need access to AuthContext so we can render conditionally depending on
  // if the profile belongs to the currently logged-in user
  const value = useAuth();
  const {
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
      <ContentContainer>
        {fullName && <h2>{fullName}</h2>}
        <h3>@{username}</h3>
        {account.isBlocked && <h4>This account has been temporarily suspended.</h4>}
        <p>{description ? description : "404: description not found."}</p>
        <p>Joined: {moment(account.createdAt).format("MMMM YYYY")}</p>

        {username === viewerUsername && (
          <ButtonContainer>
            <EditButton
              onClick={() => {
                history.push("/settings/profile");
              }}
            >
              Edit Profile
            </EditButton>
            <EditButton
              onClick={() => {
                history.push("/settings/account");
              }}
            >
              Account Settings
            </EditButton>
          </ButtonContainer>
        )}
      </ContentContainer>
    </FlexContainer>
  );
};

export default ProfileData;

const FlexContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const AvatarContainer = styled.div`
  width: 68px;
  height: 68px;
  overflow: hidden;
  border-radius: 50%;
  margin-right: 4rem;

  img {
    object-fit: cover;
  }
`;

const ContentContainer = styled.div`
  margin-left: 2rem;

  h2 {
    font-size: var(--step-2);
    font-weight: 600;
    margin-bottom: 1.2rem;
  }
  h3 {
    font-size: var(--step-1);
    font-weight: 600;
    margin-bottom: 2.4rem;
  }
  p {
    font-size: var(--step-1);
    margin-bottom: 1.8rem;
  }
`;

const ButtonContainer = styled.div`
  margin: 8rem 0 4rem;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > * + * {
    margin-top: var(--step-5);
  }
`;

const EditButton = styled(BigButton)`
  background-color: ${colors.secondary};

  &:hover,
  &:focus {
    background-color: ${colors.primary};
  }
`;