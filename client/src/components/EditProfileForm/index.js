import React, { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import styled from "styled-components";

import { GET_VIEWER } from "../../graphql/queries";
import { UPDATE_PROFILE } from "../../graphql/mutations";
import { updateProfileRunUser } from "../../lib/updateQueries";
import Loader from "../Loader";

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

  const { register, handleSubmit, errors, formState } = useForm({
    defaultValues: {
      username: profileData.username,
      description: profileData.description || "",
      fullName: profileData.fullName || ""
    }
  });
  
  const onSubmit = data => {
    const { description, fullName, username } = data;
    updateProfile({
      variables: {
        data: {
          description,
          fullName,
          username,
          avatar: imageFile
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
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label htmlFor="username">Pick a unique username:</label>
        <input
          name="username"
          id="username"
          type="text"
          ref={register({ required: true, pattern: /^[A-Za-z\d_]*$/ })} />
        {errors.username?.type === "required" && <span>This field is required</span>}
        {errors.username?.type === "validate" && <span>Alphanumeric characters only</span>}
        {error && error.message.includes("duplicate key") && <span>Username is already in use</span>}
      </div>

      <div>
        <label htmlFor="fullName">Your full name:</label>
        <input name="fullName" id="fullName" type="text" ref={register} />
      </div>

      <div>
        <label htmlFor="description">A short bio or description about yourself:</label>
        <textarea name="description" id="description" ref={register}></textarea>
      </div>

      <div>
        <label htmlFor="avatarInput">Avatar (choose a square image for best results):</label>
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
        <Avatar>
          <img
            src={imageFile || profileData.avatar}
            alt={`${formState.fullName}'s avatar`}
          />
        </Avatar>
      </div>

      <FlexContainer>
        {loading && <Loader />}
        {showSavedMessage && <p>Changes saved!</p>}
        <button disabled={loading} type="submit">
          Save Profile
        </button>
      </FlexContainer>
    </form>
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

const Avatar = styled.div`
  align-self: start;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  margin-left: 2rem;

  & > img {
    object-fit: cover;
  }
`;