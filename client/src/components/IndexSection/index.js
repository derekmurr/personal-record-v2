import React from "react";
import styled from "styled-components";

import { useAuth } from "../../context/AuthContext";
import { colors, breakpoints } from "../../styles";

const SectionTwo = () => {
  const { login } = useAuth();

  return (
    <SecondSection>
      <Alert>
        <p>IMPORTANT NOTE: this app is very early in development and you should not trust your data to it. It will be in a more stable place in the coming months, but for now, this is just for funsies, OK?</p>
      </Alert>
      <FlexContainer>
        <HalfSection>
          <h2>Welcome back</h2>
          <p>Hello again! Want to jump right in and log your workouts? You’ll have to log in first. Want to sign up for a free account? Same button!</p>
          <button onClick={login}>Log in / Sign up</button>
        </HalfSection>
        <HalfSection>
          <h2>What’s new?</h2>
          <p>August 26, 2020: Full re-write of the database and server-side code, featuring more secure sign-in - laying the groundwork for future additions! Note that the calendar view is offline while I re-write it to make it better!</p>
        </HalfSection>
      </FlexContainer>
    </SecondSection>
  );
};

export default SectionTwo;

const SecondSection = styled.section`
  padding: 4rem 0;
  color: ${colors.white};

  p {
    font-size: 1.85rem;
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  p:last-of-type {
    margin-bottom: 4rem;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;

  & > * + * {
    margin-inline-start: 2rem;
  }

  @media(max-width: ${breakpoints.mobile}) {
    flex-direction: column;

    & > * + * {
      margin-inline-start: 0;
      margin-top: 4rem;
    }
  }
`;

const Alert = styled.div`
  margin: 0 auto 2rem;
  max-width: 800px;
`;

const HalfSection = styled.div`
  flex-basis: 50%;

  @media(max-width: ${breakpoints.mobile}) {
    flex-basis: unset;
  }
`;