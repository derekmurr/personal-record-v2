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
      <div>
        <p>Daily Distances chart</p>
        <p>Planned runs list</p>
      </div>
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