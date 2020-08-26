import React from "react";
import { Redirect } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import MainLayout from "../../layouts/MainLayout";
import IndexHero from "../../components/IndexHero";
import IndexSection from "../../components/IndexSection";

const Index = () => {
  const { checkingSession, isAuthenticated, viewerQuery } = useAuth();
  let viewer;

  if (viewerQuery && viewerQuery.data) {
    viewer = viewerQuery.data.viewer;
  }

  if (checkingSession) {
    return <Loader centered />;
  } else if (isAuthenticated && viewer) {
    // If an authenticated user tries to access the "/" route, redirect them
    // to "/home" instead, since they're already logged-in.
    return <Redirect to="/home" />;
  }

  return (
    <MainLayout>
      <IndexHero />
      <IndexSection />
    </MainLayout>
  );
};

export default Index;
