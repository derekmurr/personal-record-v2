import React from "react";
import { Route, Switch, NavLink, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { FiHome, FiCalendar, FiList, FiUser } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import MainLayout from "../../layouts/MainLayout";
import { colors, breakpoints } from "../../styles";
import CalendarView from '../Calendar';
import Dashboard from '../Dashboard';
import ListView from '../ListView';
import Profile from '../Profile';
import Shoes from '../Shoes';
import AddRun from '../AddRun';
import EditRun from '../EditRun';
import RunDetail from '../RunDetail';

const Home = () => {  
  const { viewerQuery } = useAuth();
  const { username } = viewerQuery.data.viewer.profile;
  return (
    <MainLayout>
      <Navigation>
        <NavUl>
          <li>
            <NavLink exact to="/"><FiHome /><span>Dashboard</span></NavLink>
          </li>
          <li>
            <NavLink to="/calendar"><FiCalendar /><span>Calendar</span></NavLink>
          </li>
          <li>
            <NavLink to="/list"><FiList /><span>All runs</span></NavLink>
          </li>
          <li>
            <NavLink to={`/profile/${username}`}><FiUser /><span>Profile</span></NavLink>
          </li>
        </NavUl>
      </Navigation>

      <Switch>
        <Route path="/calendar">
          <CalendarView />
        </Route>
        <Route path="/list">
          <ListView />
        </Route>
        <Route path="/shoes">
          <Shoes />
        </Route>
        <Route path={`/profile/${username}`}>
          <Profile />
        </Route>
        <Route path="/runs/add">
          <AddRun />
        </Route>
        <Route path={`${username}/runs/:runId/edit`}>
          <EditRun />
        </Route>
        <Route path={`${username}/runs/:runId`}>
          <RunDetail />
        </Route>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </MainLayout>
  );
};

export default Home;

const Navigation = styled.nav`
  margin: 0 auto;
  padding: 2rem 0;

  a {
    color: ${colors.white};
    font-family: var(--font-condensed);
    font-size: 2.1rem;
    text-decoration: none;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid transparent;
    transition: border-bottom 0.3s ease;
  }
  a:hover,
  a:focus {
    border-bottom: 2px solid ${colors.primary};
  }
  & a.active {
    border-bottom: 2px solid ${colors.primary};
  }
  a svg {
    margin-right: 2rem;
  }

  @media(max-width: ${breakpoints.mobile}) {
    span {
      display: none;
    }
    a svg {
      margin-right: 0;
    }
  }
`;

const NavUl = styled.ul`
  display: flex;
  justify-content: center;

  & > li + li {
    margin-left: 8rem;
    @media(max-width: ${breakpoints.mobile}) {
      margin-left: 4rem;
    }
  }
`;