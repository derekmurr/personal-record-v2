import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import MainLayout from "../../layouts/MainLayout";
import SubNav from "../../components/SubNav";
import Calendar from "../../components/Calendar";
import { TitleBlock, LittleButton } from "../../elements";
import { colors } from "../../styles";

const CalendarView = () => {

  return (
    <MainLayout>
      <SubNav />
      <TitleBlock>
        <h1>Calendar</h1>
        <StyledButton as={Link} to="/runs/add">Add new run</StyledButton>
      </TitleBlock>

      <Calendar />
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
