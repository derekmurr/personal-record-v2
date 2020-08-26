import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

import { useAuth } from "../../context/AuthContext";
import { colors } from "../../styles";

const NavBar = () => {
  const { login, logout, viewerQuery } = useAuth();
  const history = useHistory();
  const location = useLocation();

  const { profile } = viewerQuery.data.viewer;

  return (
    <nav>
      <MainMenu>
        {location.pathname !== "/" ? (
          <li>Welcome ${profile.username}!</li>
        ) : (
          <li>Welcome!</li>
        )}
        <li>
          <LogoutButton onClick={() => {
            history.push(`/profile/${viewerQuery.data.viewer.profile.username}`);
          }}>
            My Profile
          </LogoutButton>
        </li>
        <li>
          {profile ? (
            <LogoutButton onClick={logout}>
              Logout
            </LogoutButton>
          ) : (
            <LogoutButton onClick={login}>
              Login
            </LogoutButton>
          )}
        </li>
      </MainMenu>
    </nav>
  );
};

export default NavBar;

const MainMenu = styled.ul`
  list-style: none;
  display: flex;
  justify-content: flex-end;
  margin: 0;
  padding: 0;
  
  li {
    padding: 0;
    margin-inline-start: 2rem;
  }
`;

const LogoutButton = styled.button`
  appearance: none;
  background-color: transparent;
  border: none;
  color: ${colors.white};
  cursor: pointer;
  margin: 0;
  padding: 0;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: color 0.3s ease, text-decoration-color 0.3s ease;

  &:focus,
  &:hover {
    color: ${colors.linkPrimary};
    text-decoration-color: ${colors.linkPrimary};
  }
`;