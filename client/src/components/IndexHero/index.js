import React from "react";
import styled from "styled-components";

import { GridWrapper } from "../../elements";
import { colors, breakpoints } from "../../styles";

// Potentially useful for manually getting a token to login the test account
// import fetch from 'node-fetch';
// import { URLSearchParams } from 'url';

// const params = new URLSearchParams();
// params.append('grant_type', 'password');
// params.append('username', 'user@domain.com');
// params.append('password', 'supersecretpassword');
// params.append('scope', 'read:sample');
// params.append('client_id', 'the client id of the application you created, in our case a Cypress machine-to-machine application');
// params.append('client_secret', 'the client secret for the application above');
// params.append('audience', 'the identifier API that this application is linked to; we used our GraphQL API');

// (async function main() {
//   const response = await fetch('https://YOUR-DOMAIN/oauth/token', {
//     method: 'POST',
//     body: params,
//   });
//   const json = await response.json();
//   console.log(json);
// })();

const IndexHero = () => {
  // const handleTestLogin = () => {
  //   console.log("clicky");
  // }

  return (
    <HeroSection>
      <GridWrapper>
        <ContentBlock>
          <h1>Personal Record</h1>
          <HeroPara>Hello! Personal Record is a simple web app for logging your runs &amp; planning upcoming workouts. This is very much a work in progress, but we’ve got plans to add lots more functionality over the coming months, so check back!</HeroPara>
          {/* <HeroPara>No sign-up needed if you just want to test-drive the app: just click this button to play with the open guest account!</HeroPara>
          <TrialButton onClick={handleTestLogin}>
            Try it out!
          </TrialButton> */}
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
    font-size: 3.8rem;
    margin-bottom: 2rem;
  }
`;

const HeroPara = styled.p`
  font-size: 2.2rem;
  line-height: 1.6;
  letter-spacing: -0.05rem;
  margin-bottom: 2rem;

  @media(max-width: ${breakpoints.mobile}) {
    font-size: 1.9rem;
  }

  &:last-of-type {
    margin-bottom: 4rem;
  }
`;

// const TrialButton = styled.button`
//   appearance: none;
//   background-color: ${colors.primary};
//   border-radius: 4px;
//   color: ${colors.white};
//   font-family: var(--font-heading);
//   font-size: 2.1rem;
//   padding: 1rem 2.4rem;
//   display: inline-flex;
//   justify-content: center;
//   align-items: center;
//   white-space: nowrap;
//   text-decoration: underline;
//   text-decoration-color: transparent;

//   &:hover,
//   &:focus {
//     background-color: ${colors.secondary};
//     text-decoration-color: ${colors.white};
//   }
// `;
