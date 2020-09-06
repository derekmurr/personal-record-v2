import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import MainLayout from "../../layouts/MainLayout";
import SubNav from "../../components/SubNav";
import { TitleBlock, LittleButton } from "../../elements";
import { colors } from "../../styles";

const CalendarView = () => {

  return (
    <MainLayout>
      <SubNav />
      <TitleBlock>
        <h1>Calendar</h1>
        <StyledButton as={NavLink} to="/runs/add">Add new run</StyledButton>
      </TitleBlock>

      <StyledSection>
        <h2>This page is a placeholder</h2>
        <p>Sorry! Doing some work on the server side. This page will be back soon, with:</p>
        <p>Calendar view showing all planned and completed runs</p>
        <p>Quick-add functionality (click a day, add a basic run entry from a pop-up)</p>
      </StyledSection>
    </MainLayout>
  );
};

export default CalendarView;

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