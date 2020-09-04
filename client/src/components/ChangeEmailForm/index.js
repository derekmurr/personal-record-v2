import React from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import validator from "validator";
import styled from "styled-components";

import { UPDATE_ACCOUNT } from "../../graphql/mutations";
import { FormLabel, TextInput, LittleButton } from "../../elements";
import { colors } from "../../styles";

const ChangeEmailForm = ({ logout, viewerId, viewerEmail }) => {
  const [updateAccountEmail, { loading }] = useMutation(UPDATE_ACCOUNT, {
    onCompleted: logout
  });

  const { errors, register, handleSubmit, watch } = useForm();

  const watchEmail = watch("email");

  const onSubmit = (data) => {
    updateAccountEmail({
      variables: {
        data: { email: data.email },
        where: { id: viewerId }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} autoComplete="off" noValidate >
      <InputContainer>
        <FormLabel htmlFor="email">New email address:</FormLabel>
        <TextInput
          type="email"
          id="email"
          name="email"
          placeholder="New email address"
          ref={register({
            required: true,
            validate: {
              isEmail: value => validator.isEmail(value)
            }
          })}
          required />
      </InputContainer>
      {errors.email?.type === "required" && (
        <ErrorText>A new email address is required!</ErrorText>
      )}
      {errors.email?.type === "isEmail" && (
        <ErrorText>Please enter a valid email address.</ErrorText>
      )}
      <SubmitButton
        disabled={loading || viewerEmail === watchEmail}
        type="submit"
      >
        Save
      </SubmitButton>
    </form>
  );
};

export default ChangeEmailForm;

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
