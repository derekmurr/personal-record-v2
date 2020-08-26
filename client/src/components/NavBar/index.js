import React from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";

import { useAuth } from "../../context/AuthContext";
import { colors } from "../../styles";

const NavBar = () => {
  const { login, logout, viewerQuery } = useAuth();
  const location = useLocation();

  let displayName;
  if (viewerQuery && viewerQuery.data) {
    displayName = viewerQuery.data.viewer.profile.fullName 
      ? viewerQuery.data.viewer.profile.fullName.split(" ")[0] 
      : viewerQuery.data.viewer.profile.username;
  }

  return (
    <nav>
      <MainMenu>
        {location.pathname !== "/" ? (
          <li>Welcome, {displayName}!</li>
        ) : (
          <li>Welcome!</li>
        )}
        <li>
          {viewerQuery && viewerQuery.data ? (
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
  font-size: var(--step-0);
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
  font-family: var(--font-condensed);
  font-size: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  margin: 0;
  padding: 0;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: color 0.3s ease, text-decoration-color 0.3s ease;

  &:focus,
  &:hover {
    color: ${colors.linkPrimary};
    outline: none;
    text-decoration-color: ${colors.linkPrimary};
  }
`;