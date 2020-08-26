import React from "react";
import styled from "styled-components";

import { breakpoints } from "../../styles";

const HeaderLogo = () => {
  return (
    <div>
      <DesktopLogo>
        Personal Record
      </DesktopLogo>
      <MobileLogo>
        PR
      </MobileLogo>
    </div>
  );
};

export default HeaderLogo;

const DesktopLogo = styled.h4`
  font-size: var(--step-0);
  font-weight: 600;
  margin: 0;
  @media(max-width: ${breakpoints.mobile}) {
    display: none;
  }
`;

const MobileLogo = styled.h4`
  font-size: var(--step-0);
  font-weight: 600
  display: none;
  margin: 0;
  @media(max-width: ${breakpoints.mobile}) {
    display: block;
  }
`;
