import React from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import { CREATE_PROFILE } from "../../graphql/mutations";
import { GET_VIEWER } from "../../graphql/queries";
import Loader from "../Loader";
import { colors } from "../../styles";
import { BigButton, ModalCard, InputContainer, FormLabel, TextInput } from "../../elements";

const CreateProfileForm = ({ accountId, updateViewer }) => {
  // Update the Apollo Client cache with new data once this mutation has
  // run, by passing in an options object as a second argument to 
  // useMutation. That object contains an update method, which has access
  // to the Apollo Client cache object as well as the data returned from
  // the mutation (via the destructured createProfile object). We use these
  // values to get the existing viewer from the cache using the readQuery
  // method, and update it with the new profile data using the writeQuery
  // method. Then we call the updateViewer function to update the
  // viewerQuery value in the AuthContext.
  const [createProfile, { error, loading }] = useMutation(CREATE_PROFILE, {
    update: (cache, { data: { createProfile } }) => {
      const { viewer } = cache.readQuery({ query: GET_VIEWER });
      const viewerWithProfile = { ...viewer, profile: createProfile };
      cache.writeQuery({
        query: GET_VIEWER,
        data: { viewer: viewerWithProfile }
      });
      updateViewer(viewerWithProfile);
    }
  });

  const { register, handleSubmit, errors } = useForm();
  const onSubmit = data => {
    createProfile({
      variables: { 
        data: { accountId, ...data }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <ModalCard>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <FormLabel htmlFor="username">Pick a unique username:</FormLabel>
          <TextInput 
            name="username" 
            id="username" 
            type="text" 
            ref={register({ required: true, pattern: /^[A-Za-z\d_]*$/ })} />
          {errors.username?.type === "required" && <span>This field is required</span>}
          {errors.username?.type === "validate" && <span>Alphanumeric characters only</span>}
          {error && error.message.includes("duplicate key") && <span>Username is already in use</span>}
          </InputContainer>

        <InputContainer>
          <FormLabel htmlFor="fullName">Your full name:</FormLabel>
          <TextInput name="fullName" id="fullName" type="text" ref={register} />
        </InputContainer>

        <InputContainer>
          <FormLabel htmlFor="description">A short bio or description about yourself:</FormLabel>
          <TextInput as="textarea" name="description" id="description" ref={register}></TextInput>
        </InputContainer>

          {loading && <Loader />}
          <SubmitButton disabled={loading} type="submit">
            Create Profile
          </SubmitButton>
      </form>
    </ModalCard>
  );
};

export default CreateProfileForm;

const SubmitButton = styled(BigButton)`
  background-color: ${colors.confirm};

  &:hover,
  &:focus {
    background-color: ${colors.secondary};
  }
`;
