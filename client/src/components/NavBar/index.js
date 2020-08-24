import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import styled from "styled-components";

import { useAuth } from "../../context/AuthContext";

const NavBar = () => {
  const { logout, viewerQuery } = useAuth();
  const history = useHistory();
  const location = useLocation();

  return (
    <nav>
      <MainMenu>
        {location.pathname !== "/" && (
          <li>
            Welcome!
          </li>
        )}
        <li>
          <button onClick={() => {
            history.push(`/profile/${viewerQuery.data.viewer.profile.username}`);
          }}>
            My Profile
          </button>
        </li>
        <li>
          <button onClick={logout}>
            Logout
          </button>
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