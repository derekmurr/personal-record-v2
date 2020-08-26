import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { FiHome, FiCalendar, FiList, FiUser } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import { colors, breakpoints } from "../../styles";

const SubNav = () => {
  const { viewerQuery } = useAuth();
  const { username } = viewerQuery.data.viewer.profile;

  return (
    <Navigation>
      <NavUl>
        <li>
          <NavLink exact to="/home"><FiHome /><span>Dashboard</span></NavLink>
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
  );
};

export default SubNav;

const Navigation = styled.nav`
  margin: 0 auto 2rem;
  padding: 1rem 0 2rem;

  a {
    color: ${colors.white};
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: var(--font-condensed);
    font-size: var(--step-2);
    text-decoration: none;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid transparent;
    transition: border-bottom 0.3s ease, color 0.3s ease;
  }
  a:hover,
  a:focus {
    color: ${colors.linkPrimary};
    border-bottom: 2px solid ${colors.primary};
    outline: none;
  }
  & a.active {
    border-bottom: 2px solid ${colors.primary};
  }
  a svg {
    margin-right: 2rem;
  }
  span {
    font-size: var(--step-1);
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
