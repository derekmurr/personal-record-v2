import React from "react";
import styled from "styled-components";

import { colors, breakpoints } from "../../styles";
import { Wrapper } from "../../elements";

const Footer = () => {
  return (
    <FooterSection>
      <Wrapper>
        <FlexContainer>
          <p>Made in Toronto by Derek Murr, <a href='https://twitter.com/derekmurr' target='_blank' rel='noopener noreferrer'>@derekmurr</a></p>
          <p>&copy; 2020. Thanks for stopping by!</p>
        </FlexContainer>
      </Wrapper>
    </FooterSection>
  );
};

export default Footer;

const FooterSection = styled.footer`
  background-color: ${colors.backgroundDark};
  padding: 2rem 0;
  font-size: var(--step--1);

  a {
    color: ${colors.linkPrimary};
  }
  a:hover,
  a:focus {
    outline: none;
    text-decoration-color: ${colors.linkPrimary};
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
  @media(max-width: ${breakpoints.mobile}) {
    flex-direction: column;
    > p + p {
      margin-top: 1.4rem;
    }
  }
`;