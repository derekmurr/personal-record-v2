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