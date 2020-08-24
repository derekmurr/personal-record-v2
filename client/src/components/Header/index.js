import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { colors } from "../../styles"
import HeaderLogo from "../HeaderLogo";
import NavBar from "../NavBar";
import { Wrapper, FlexContainer } from "../../elements";

const Header = () => {
  return (
    <SiteHeader>
      <Wrapper>
        <FlexContainer>
          <NavLink exact to="/">
            <HeaderLogo />
          </NavLink>
          <NavBar />
        </FlexContainer>
      </Wrapper>
    </SiteHeader>
  );
};

export default Header;

const SiteHeader = styled.header`
  background-color: ${colors.background};
  border-bottom: 3px solid ${colors.primary};
  padding: 1rem 0;
`;
