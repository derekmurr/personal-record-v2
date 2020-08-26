import React from "react";
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
          <HeaderLogo />
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
  padding: 2rem 0;
`;
