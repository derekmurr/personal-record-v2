import { Redirect } from "react-router-dom";
import React, { useRef, useState } from "react";
import styled from "styled-components";

import { useAuth } from "../../../context/AuthContext";
import CreateProfileForm from "../../../components/CreateProfileForm";
import EditProfileForm from "../../../components/EditProfileForm";
import Portal from "../../../utilities/Portal";

const ProfileSettings = ({ history }) => {
  const [modalOpen, setModalOpen] = useState(true);
  const { viewerQuery, updateViewer } = useAuth();
  const { id, profile } = viewerQuery.data.viewer;

  const handleClose = () => {
    setModalOpen(false);
    history.push(`/profile/${profile.username}`);
  }
  
  // The useRef hook caches the initial value of profile from AuthContext.
  // For a new user, that value will be null.
  const profileRef = useRef(profile);

  // On re-render, we check if the cached profileRef value is null and
  // the new profile value is not null. If that is true, then a profile
  // has just been saved for a user that didn't previously have one, so
  // we redirect to the /profile route instead of re-rendering the form.
  if (!profileRef.current && profile) {
    return <Redirect to={`/profile/${profile.username}`} />;
  }

  return (
    <Portal>
      {modalOpen && (
        <ModalWrapper>
          <ModalCard>
            <p>
              {profile
                ? "Update your user information below:"
                : "Please create your user profile before proceeding:"}
            </p>
            {profile ? (
              <EditProfileForm
                profileData={profile}
                updateViewer={updateViewer}
              />
            ) : (
                <CreateProfileForm accountId={id} updateViewer={updateViewer} />
              )}
          </ModalCard>
          <Background onClick={handleClose} />
        </ModalWrapper>
      )}
    </Portal>
  );
};

export default ProfileSettings;

const ModalWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalCard = styled.div`
  max-width: 500px;
  min-width: 320px;
  z-index: 15;
  padding: 15px;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 10;
`;