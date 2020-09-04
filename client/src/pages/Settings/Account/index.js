import React from "react";
import { useMutation } from "@apollo/client";
import passwordValidator from "password-validator";
import validator from "validator";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import { UPDATE_ACCOUNT } from "../../../graphql/mutations";
import { useAuth } from "../../../context/AuthContext";

import DeleteAccount from "../../../components/DeleteAccount";
import MainLayout from "../../../layouts/MainLayout";
import Modal from "../../../components/Modal";
import SubNav from "../../../components/SubNav";
import { Toggle } from "../../../utilities";
import { FormLabel, TextInput, TitleBlock, LittleButton } from "../../../elements";
import { colors } from "../../../styles";

const schema = new passwordValidator();
schema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols();

const AccountSettings = () => {
  const { logout, viewerQuery } = useAuth();
  const { email: viewerEmail, id: viewerId } = viewerQuery.data.viewer;

  const [updateAccountEmail, { loading }] = useMutation(UPDATE_ACCOUNT, {
    onCompleted: logout
  });
  const [updateAccountPassword] = useMutation(UPDATE_ACCOUNT, {
    onCompleted: logout
  });

  const { register, handleSubmit, watch } = useForm();

  const watchEmail = watch("email");
  const watchPassword = watch("password");
  const watchNewPassword = watch("newPassword");

  const submitEmail = (data) => {
    updateAccountEmail({
      variables: {
        data: { email: data.email },
        where: { id: viewerId }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  const submitPassword = data => {
    updateAccountPassword({
      variables: {
        data: { password: data.password, newPassword: data.newPassword },
        where: { id: viewerId }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <MainLayout>
      <SubNav />
      <TitleBlock>
        <h1>Account Settings</h1>
      </TitleBlock>

      <StyledSection>
        <h2>Change email address</h2>
        <p>After updating your email you will be redirected and must log in again.</p>
        <form onSubmit={handleSubmit(submitEmail)}>
          <InputContainer>
            <FormLabel htmlFor="email">New email address:</FormLabel>
            <TextInput
              type="text"
              id="email"
              name="email"
              placeholder="New email address"
              ref={register({ required: true })}
              required />
          </InputContainer>
          <SubmitButton 
            disabled={loading || viewerEmail === watchEmail} 
            type="submit"
          >
            Save
          </SubmitButton>
        </form>
      </StyledSection>

      <StyledSection>
        <h2>Change password</h2>
        <p>After updating your password you will be redirected and must log in again.</p>
        <form onSubmit={handleSubmit(submitPassword)}>
          <InputContainer>
            <FormLabel htmlFor="email">Current password:</FormLabel>
            <TextInput
              type="text"
              id="password"
              name="pasword"
              placeholder="Current password"
              ref={register({ required: true })}
              required />
          </InputContainer>
          <InputContainer>
            <FormLabel htmlFor="email">New password:</FormLabel>
            <TextInput
              type="text"
              id="newPassword"
              name="newPassword"
              placeholder="New password"
              ref={register({ required: true })}
              required />
          </InputContainer>
          <SubmitButton 
            type="submit" 
            disabled={loading || !watchPassword || !watchNewPassword} 
          >
            Save
          </SubmitButton>
        </form>
      </StyledSection>

      <StyledSection>
        <h2>Delete account</h2>
        <WarningText><strong>Danger zone!</strong> Click this button to permanently delete your account and all of its data. This cannot be undone.</WarningText>
        <Toggle>
          {({ on, toggle }) => (
            <>
              <DeleteButton type='button' onClick={toggle}>Delete run</DeleteButton>
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
    font-size: var(--step-2);
    font-weight: 600;
    margin-bottom: 2.4rem;
  }
`;

const SubmitButton = styled(LittleButton)`
  background-color: ${colors.confirm};

  &:hover,
  &:focus {
    background-color: ${colors.secondary};
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
  
  strong {
    font-weight: 600;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  max-width: 360px;
`;