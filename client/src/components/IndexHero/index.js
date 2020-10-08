import React from "react";
import styled from "styled-components";

import { GridWrapper } from "../../elements";
import { colors, breakpoints } from "../../styles";

const IndexHero = () => {

  return (
    <HeroSection>
      <GridWrapper>
        <ContentBlock>
          <h1>Personal Record</h1>
          <HeroPara>Hello! Personal Record is a simple web app for logging your runs &amp; planning upcoming workouts. This is very much a work in progress, but we’ve got plans to add lots more functionality over the coming months, so check back!</HeroPara>
        </ContentBlock>
      </GridWrapper>
    </HeroSection>
  );
};

export default IndexHero;

const HeroSection = styled.section`
  background-image: 
    linear-gradient(135deg, rgba(192, 38, 139, 0.8) 0%, rgba(108, 80, 216, 0.8) 55%, rgba(130, 159, 214, 0.8) 100%), 
    url('./assets/splash.jpg');
  background-position: center left;
  background-repeat: no-repeat;
  background-size: cover;
  padding: 4rem 0;
`;

const ContentBlock = styled.div`
  grid-column: 7 / -2;
  color: ${colors.white};
  padding: 2.4rem 2.8rem 3.4rem;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.45);

  @media(max-width: ${breakpoints.tablet}) {
    grid-column: 4 / -2;
  }

  @media(max-width: ${breakpoints.mobile}) {
    grid-column: 2 / -2;
  }

  h1 {
    font-size: var(--step-4);
    font-weight: 600;
    margin-bottom: var(--step-2);
  }
`;

const HeroPara = styled.p`
  font-size: var(--step-1);
  line-height: 1.5;
  letter-spacing: -0.05rem;
  margin-bottom: 0;
`;
