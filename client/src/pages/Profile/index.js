import { Route } from "react-router-dom";
import { useQuery } from "@apollo/client";
import React from "react";

import { GET_PROFILE } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import MainLayout from "../../layouts/MainLayout";
import NotFound from "../NotFound";
import ProfileData from "../../components/ProfileData";
import { TitleBlock } from "../../elements";

const Profile = ({ match }) => {
  const { checkingSession, viewerQuery } = useAuth();
  let username;

  // The match prop is provided by React Router and gives access to the 
  // username URL parameter.
  if (match.params.username) {
    username = match.params.username;
  } else if (viewerQuery.data && viewerQuery.data.viewer.profile) {
    username = viewerQuery.data.viewer.profile.username;
  }

  // The skip property ensure that the GET_PROFILE query will only run 
  // if a username is available to pass into it as an argument 
  // (note there won’t be one available when the user is initially 
  // creating their profile and this page displays below the 
  // CreateProfileForm modal).
  const { data, error, loading, refetch } = useQuery(GET_PROFILE, {
    skip: !username,
    variables: { username },
  });

  // When we use the useQuery hook we destructure the data, error state
  // and loading state, and use those to conditionally render the page 
  // elements. We also destructure the refetch function and pass it as a prop
  // to the ProfileHeader component, so it can run a refetchQuery after it 
  // runs a mutation, to keep the Apollo Cache in sync with the server

  if (checkingSession || loading) {
    // If the query is loading, show our loader component
    return (
      <MainLayout>
        <Loader centered />
      </MainLayout>
    );
  } else if (data && data.profile) {
    // Once the query is finished and the profile data exists, show profile
    return (
      <MainLayout>
        <TitleBlock><h1>User Profile</h1></TitleBlock>
        <ProfileData profileData={data.profile} refetchProfile={refetch} />
      </MainLayout>
    );
  } else if (error) {
    // Handle errors generically by showing our 404 Not Found page
    return <Route component={NotFound} />;
  }

  // If no profile exists, but there was no error, as would be the case
  // during onboarding, when this page is visible beneath the CreateProfileForm
  // modal, just render MainLayout with no children
  return <MainLayout>{null}</MainLayout>;
};

export default Profile;
