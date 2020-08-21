import React from "react";
import { Route, Switch } from "react-router";

import AccountSettings from "../pages/Settings/Account";
import Index from "../pages/Index";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/PrivateRoute";
import Profile from "../pages/Profile";
import ProfileSettings from "../pages/Settings/Profile";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Index} />
    <PrivateRoute exact path="/home" component={Home} />
    <PrivateRoute
      exact
      path="/settings/profile"
      render={props => [
        <Profile key="profile" {...props} />,
        <ProfileSettings key="profile-settings" {...props} />
      ]}
    />
    <PrivateRoute exact path="/settings/account" component={AccountSettings} />
    <PrivateRoute component={NotFound} />
  </Switch>
);

export default Routes;
