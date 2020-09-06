import React from "react";
import styled from "styled-components";

import RunListItem from "../RunListItem";
import { colors } from "../../styles";

const RunList = ({ runData }) => {
  if (!runData.length) {
    return (
      <p>No runs to display yet!</p>
    );
  }


  return (
    <StyledList>
      <ListHeader>
        <h2>Showing all runs, most recent first</h2>
        <p>Search</p>
      </ListHeader>
      {runData.map(run => <RunListItem key={run.node.id} run={run.node} /> )}
    </StyledList>
  );
};

export default RunList;

const StyledList = styled.ul`
  margin-bottom: 4rem;
`;

const ListHeader = styled.li`
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid ${colors.primary};
  padding-bottom: 1rem;

  h2 {
    font-size: var(--step-0);
  }
  p {
    font-size: var(--step-0);
  }
`;

