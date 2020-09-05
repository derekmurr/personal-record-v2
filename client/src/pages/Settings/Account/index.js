import React from "react";
import styled from "styled-components";

import { useAuth } from "../../../context/AuthContext";

import ChangeEmailForm from "../../../components/ChangeEmailForm";
import ChangePasswordForm from "../../../components/ChangePasswordForm";
import DeleteAccount from "../../../components/DeleteAccount";
import MainLayout from "../../../layouts/MainLayout";
import Modal from "../../../components/Modal";
import SubNav from "../../../components/SubNav";
import { Toggle } from "../../../utilities";
import { TitleBlock, LittleButton } from "../../../elements";
import { colors } from "../../../styles";

const AccountSettings = () => {
  const { logout, viewerQuery } = useAuth();
  const { email: viewerEmail, id: viewerId } = viewerQuery.data.viewer;

  return (
    <MainLayout>
      <SubNav />
      <TitleBlock>
        <h1>Account Settings</h1>
      </TitleBlock>

      <StyledSection>
        <h2>Change email address</h2>
        <p>After updating your email you will be redirected and must log in again.</p>
        <ChangeEmailForm logout={logout} viewerId={viewerId} viewerEmail={viewerEmail} />
      </StyledSection>

      <StyledSection>
        <h2>Change password</h2>
        <p>After updating your password you will be redirected and must log in again.</p>
        <ChangePasswordForm logout={logout} viewerId={viewerId} />
      </StyledSection>

      <StyledSection>
        <h2>Delete account</h2>
        <WarningText><strong>Danger zone!</strong> Click this button to permanently delete your account and all of its data. This cannot be undone.</WarningText>
        <Toggle>
          {({ on, toggle }) => (
            <>
              <DeleteButton type='button' onClick={toggle}>Delete account</DeleteButton>
              <Modal on={on} toggle={toggle}>
                <DeleteAccount toggle={toggle} accountId={viewerId} />
              </Modal>
            </>
          )}
        </Toggle>
      </StyledSection>
    </MainLayout>
  );
};

export default AccountSettings;

const StyledSection = styled.section`
  padding: 0 0 6rem;

  h2 {
    border-bottom: 1px solid ${colors.primary};
    font-size: var(--step-2);
    font-weight: 600;
    margin-bottom: 2.4rem;
    padding-bottom: 1rem;
  }

  p {
    font-size: var(--step-1);
    line-height: 1.4;
    margin-bottom: var(--step-3);
  }
`;

const DeleteButton = styled(LittleButton)`
  background-color: ${colors.danger};

  &:hover,
  &:focus {
    background-color: ${colors.secondary};
  }
`;

const WarningText = styled.p`
  color: ${colors.danger};
  margin-bottom: var(--step-4);
  
  strong {
    font-weight: 600;
  }
`;
