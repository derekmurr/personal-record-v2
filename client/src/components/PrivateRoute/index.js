import { Redirect, Route } from "react-router-dom";
import React from "react";

import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";

// PrivateRoute component is a wrapper for React Router's "Route" component
// with some control flow built in to determine what to display, based on
// the user's authentication state. We determine if the app is currently
// checking the session; if so, display the Loader component. If the session
// is checked, and the user is authenticated, and the viewer is defined, then
// show the component that should be rendered by the route. If viewerQuery or
// viewer is empty, then redirect back to the index page.

const PrivateRoute = ({ component: Component, render, ...rest }) => {
  const { checkingSession, isAuthenticated, viewerQuery } = useAuth();
  const renderRoute = props => {
    let content = null;
    let viewer;

    if (viewerQuery && viewerQuery.data) {
      viewer = viewerQuery.data.viewer;
    }

    if (checkingSession) {
      // If the app is checking the session, show the Loader component
      content = <Loader centered />;
    } else if (
      isAuthenticated &&
      props.location.pathname !== "/settings/profile" &&
      viewer &&
      !viewer.profile
    ) {
      // If the user has signed up & is authenticated, but has not yet
      // created a profile, redirect them to the profile form
      content = <Redirect to="/settings/profile" />;
    } else if (isAuthenticated && render && viewer) {
      content = render(props);
    } else if (isAuthenticated && viewer) {
      content = <Component {...props} />
    } else if (!viewerQuery || !viewer) {
      content = <Redirect to="/" />
    }

    return content;
  };

  return <Route {...rest} render={renderRoute} />;
};

export default PrivateRoute;
