import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { TitleBlock, LittleButton } from "../../elements";
import { colors } from "../../styles";

const Dashboard = () => {
  return (
    <div>
      <TitleBlock>
        <h1>Dashboard</h1>
        <StyledButton as={NavLink} to="/runs/add">Add new run</StyledButton>
      </TitleBlock>
      <StyledSection>
        <h2>This page is a placeholder</h2>
        <p>Sorry! Doing some work on the server side. This page will be back soon, with:</p>
        <p>Daily distances chart showing completed runs (distance and type) over the previous rolling two weeks</p>
        <p>List of planned runs for the upcoming two weeks</p>
      </StyledSection>
    </div>
  );
};

export default Dashboard;

const StyledButton = styled(LittleButton)`
  background-color: ${colors.secondary};

  &:hover,
  &:focus {
    background-color: ${colors.primary};
  }
`;

const StyledSection = styled.section`
  h2 {
    font-size: var(--step-2);
    font-weight: 600;
    margin-bottom: var(--step-1);
  }

  p {
    font-size: var(--step-1);
    line-height: 1.5;
    margin-bottom: var(--step-0);
  }
`;