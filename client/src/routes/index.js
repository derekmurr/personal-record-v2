import React from "react";
import { Route, Switch } from "react-router";

import AccountSettings from "../pages/Settings/Account";
import AddRun from "../pages/AddRun";
import CalendarView from "../pages/Calendar";
import EditRun from "../pages/EditRun";
import Index from "../pages/Index";
import Home from "../pages/Home";
import ListView from "../pages/ListView";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import PrivateRoute from "../components/PrivateRoute";
import Profile from "../pages/Profile";
import ProfileSettings from "../pages/Settings/Profile";
import RunDetail from "../pages/RunDetail";
import Shoes from "../pages/Shoes";

const Routes = () => (
  <Switch>
    <Route exact path="/" component={Index} />
    <PrivateRoute exact path="/calendar" component={CalendarView} />
    <PrivateRoute exact path="/home" component={Home} />
    <PrivateRoute exact path="/list" component={ListView} />
    <Route exact path="/login" component={Login} />
    <PrivateRoute exact path="/profile/:username" component={Profile} />
    <PrivateRoute
      exact
      path="/settings/profile"
      render={props => [
        <Profile key="profile" {...props} />,
        <ProfileSettings key="profile-settings" {...props} />
      ]}
    />
    <PrivateRoute exact path="/settings/account" component={AccountSettings} />
    <PrivateRoute exact path="/shoes" component={Shoes}/>
    <PrivateRoute exact path="/runs/add" component={AddRun}/>
    <PrivateRoute exact path="/runs/:runId/edit" component={EditRun}/>
    <PrivateRoute exact path="/runs/:runId" component={RunDetail}/>
    <PrivateRoute component={NotFound} />
  </Switch>
);

export default Routes;
