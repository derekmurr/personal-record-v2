import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import styled from "styled-components";

import { colors } from "../../styles";

const PlannedRuns = ({ runData }) => {

  return (
    <StyledSection>
      <h2>Upcoming planned runs</h2>
      <h3>Next 7 days</h3>
      <ListBox>
        {runData.length === 0 && <li><p>Nothing planned for the next week.</p></li>}
        {runData.map((run, i) =>
          <li key={`runItem${i}`}>
            <Link to={`/runs/${run.node.id}`}>
              <span>{moment(run.node.start).format("Do MMM")}: </span>
              {run.node.distance}km {run.node.workoutType}
            </Link>
          </li>
        )}
      </ListBox>
    </StyledSection>
  );
};

export default PlannedRuns;

const StyledSection = styled.section`
  h2 {
    font-size: var(--step-1);
    font-weight: 600;
    margin-bottom: var(--step-1);
  }

  h3 {
    font-size: var(--step-0);
    font-weight: 600;
    line-height: 1.5;
    margin-bottom: var(--step-2);
  }
`;

const ListBox = styled.ul`
  color: ${colors.white};
  border: 1px solid ${colors.white};
  min-width: 260px;

  span {
    font-weight: 800;
  }
  a {
    color: ${colors.white};
    display: block;
    margin: 0;
    padding: 1.6rem;
    text-decoration: underline;
    text-decoration-color: transparent;
    transition: text-decoration-color 0.3s ease;

    &:hover,
    &:focus {
      text-decoration-color: ${colors.white};
    }
  }
  li {
    background-color: ${colors.background};
    transition: background-color 0.3s ease;

    &:focus-within,
    &:hover {
      background-color: ${colors.backgroundDark};
    }
  }
  li + li {
    border-top: 1px solid ${colors.defaultColor};
  }
`;