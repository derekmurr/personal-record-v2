import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import { GET_VIEWER } from "../../graphql/queries";
import { UPDATE_PROFILE } from "../../graphql/mutations";
import { updateProfileRunUser } from "../../lib/updateQueries";
import Loader from "../Loader";
import { colors } from "../../styles";
import { BigButton, ModalCard, InputContainer, FormLabel, TextInput } from "../../elements";

const EditProfileForm = ({ profileData, updateViewer }) => {
  const [imageFile, setImageFile] = useState();
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const [updateProfile, { error, loading }] = useMutation(UPDATE_PROFILE, {
    update: (cache, { data: { updateProfile } }) => {
      const { viewer } = cache.readQuery({ query: GET_VIEWER });
      const viewerWithProfile = { ...viewer, profile: updateProfile };
      cache.writeQuery({
        query: GET_VIEWER,
        data: { viewer: viewerWithProfile }
      });
      // This updates the Apollo Client cache so posts and replies show the
      // correct profile info when the user closes the modal after a save
      updateProfileRunUser(
        cache,
        profileData.username,
        updateProfile
      );
      updateViewer(viewerWithProfile);
    },
    onCompleted: () => {
      setShowSavedMessage(true);
    }
  });

  const { register, handleSubmit, errors } = useForm({
    defaultValues: {
      username: profileData.username,
      description: profileData.description || "",
      fullName: profileData.fullName || ""
    }
  });
  
  const onSubmit = data => {
    const { description, fullName, username, avatarInput } = data;
    const file = avatarInput[0];
    updateProfile({
      variables: {
        data: {
          description,
          fullName,
          username,
          ...(file && { avatar: file })
        },
        where: { username: profileData.username }
      }
    }).catch(err => {
      console.log(err);
    });
  }

  useEffect(() => {
    // We'll display the "Changes saved!" message briefly after a successful
    // mutation, so we use a useEffect hook to set a timer on the visibility.
    // Return a function from useEffect that calls clearTimeout to clean up
    // the timer if the component un-mounts
    const timer = setTimeout(() => {
      setShowSavedMessage(false);
    }, 4000);
    return () => {
      clearTimeout(timer);
    };
  });

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
          {errors.username?.type === "required" && <ErrorText>This field is required</ErrorText>}
          {errors.username?.type === "validate" && <ErrorText>Alphanumeric characters only</ErrorText>}
          {error && error.message.includes("duplicate key") && <ErrorText>Username is already in use</ErrorText>}
        </InputContainer>

        <InputContainer>
          <FormLabel htmlFor="fullName">Your full name:</FormLabel>
          <TextInput name="fullName" id="fullName" type="text" ref={register} />
        </InputContainer>

        <InputContainer>
          <FormLabel htmlFor="description">A short bio or description about yourself:</FormLabel>
          <TextInput as="textarea" name="description" id="description" ref={register}></TextInput>
        </InputContainer>

        <InputContainer>
          <FormLabel htmlFor="avatarInput">Avatar (choose a square image for best results):</FormLabel>
          <AvatarContainer>
            <Avatar>
              <img
                src={imageFile || profileData.avatar}
                alt={`${profileData.username}'s avatar`}
              />
            </Avatar>
            <input
              type="file" 
              name="avatarInput" 
              id="avatarInput" 
              onChange={event => {
                setImageFile(
                  event.target.files.length
                    ? URL.createObjectURL(event.target.files[0])
                    : null
                );
              }} 
              ref={register(
                { validate: value => {
                  if (value.files) {
                    const { files: [file] } = value;
                    if (file && file.size > 2 * 1024 * 1024) {
                      return "Maximum file size is 2 MB";
                    }
                  }
                }}
              )} 
              accept=".png, .jpg, .jpeg" 
            />
          </AvatarContainer>
        </InputContainer>

        <FlexContainer>
          {loading && <Loader />}
          {showSavedMessage && <SaveMessage>Changes saved!</SaveMessage>}
          <SubmitButton disabled={loading} type="submit">
            Save Profile
          </SubmitButton>
        </FlexContainer>
      </form>
    </ModalCard>
  );
};

export default EditProfileForm;

const FlexContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  
  & > * + * {
    margin-inline-start: 2rem;
  }
`;

const AvatarContainer = styled.div`
  display: flex;
  justify-content: flex-start;
`;

const Avatar = styled.div`
  align-self: start;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin-right: 2rem;

  & > img {
    object-fit: cover;
  }
`;

const SubmitButton = styled(BigButton)`
  background-color: ${colors.confirm};

  &:hover,
  &:focus {
    background-color: ${colors.secondary};
  }
`;

const SaveMessage = styled.p`
  color: ${colors.confirm};
  font-size: var(--step-1);
  font-weight: 600;
  margin-right: 2rem;
`;

const ErrorText = styled.span`
  color: ${colors.danger};
  margin-top: var(--step--2);
`;
