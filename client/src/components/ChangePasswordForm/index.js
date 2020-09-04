import React from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import passwordValidator from "password-validator";
import styled from "styled-components";

import { UPDATE_ACCOUNT } from "../../graphql/mutations";
import { FormLabel, TextInput, LittleButton } from "../../elements";
import { colors } from "../../styles";

const schema = new passwordValidator();
schema
  .is().min(8)
  .has().uppercase()
  .has().lowercase()
  .has().digits()
  .has().symbols();

const ChangePasswordForm = ({ logout, viewerId }) => {
  const [updateAccountPassword, { loading }] = useMutation(UPDATE_ACCOUNT, {
    onCompleted: logout
  });

  const { errors, register, handleSubmit, watch } = useForm();

  const watchPassword = watch("password");
  const watchNewPassword = watch("newPassword");

  const onSubmit = data => {
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
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate >
      <InputContainer>
        <FormLabel htmlFor="password">Current password:</FormLabel>
        <TextInput
          type="text"
          id="password"
          name="password"
          placeholder="Current password"
          ref={register({ required: true })}
          required />
      </InputContainer>
      <InputContainer>
        <FormLabel htmlFor="newPassword">New password:</FormLabel>
        <TextInput
          type="text"
          id="newPassword"
          name="newPassword"
          placeholder="New password"
          ref={register({
            required: true,
            validate: {
              passwordStrength: value => schema.validate(value)
            }
          })}
          required />
      </InputContainer>
      {errors.password?.type === "required" && (
        <ErrorText>Your current password is required!</ErrorText>
      )}
      {errors.newPassword?.type === "required" && (
        <ErrorText>A new password is required!</ErrorText>
      )}
      {errors.newPassword?.type === "passwordStrength" && (
        <ErrorText>Passwords must be at least 8 characters with lowercase and uppercase letters, digits, and special characters.</ErrorText>
      )}
      <SubmitButton
        type="submit"
        disabled={loading || !watchPassword || !watchNewPassword}
      >
        Save
      </SubmitButton>
    </form>
  );
};

export default ChangePasswordForm;

const SubmitButton = styled(LittleButton)`
  background-color: ${colors.confirm};

  &:hover,
  &:focus {
    background-color: ${colors.secondary};
  }
`;

const ErrorText = styled.p`
  color: ${colors.danger};
  font-size: var(--step-0);
  font-weight: 600;
  margin-bottom: 1rem;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  max-width: 360px;
`;

