import React from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { colors } from "../../styles";

const Event = ({ run }) => {
  const history = useHistory();
  const eventColor = run.workoutType === "defaultRun" ? "defaultColor" : run.workoutType.toLowerCase();
  let textColor = colors.backgroundDark;
  if (run.workoutType === "Tempo" || run.workoutType === "Long" || run.workoutType === "Race" || run.completed === false) {
    textColor = colors.white;
  }
  return (
    <EventLink 
      completed={run.completed}
      eventColor={eventColor}
      textColor={textColor}
      onClick={() => history.push(`/runs/${run.id}`)}
    >
      <span>{`${run.distance}km ${run.workoutType}`}</span>
    </EventLink>
  );
};

export default Event;

const EventLink = styled.button`
  appearance: none;
  background-color: ${props => props.completed ? colors[props.eventColor] : "transparent"};
  border: ${props => props.completed ? "0" : `1px solid ${colors[props.eventColor]}`};
  border-radius: 4px;
  color: ${props => props.textColor};
  cursor: pointer;
  display: block;
  font-size: var(--step--1);
  margin: 1px 0;
  padding: 8px;
  text-align: left;

  &:focus,
  &:hover {
    box-shadow: 0px 0px 0px 2px inset ${colors.primary};
    outline: none;
  }

  @media (max-width: 675px) {
    padding: 4px;
    pointer-events: none;
    span {
      display: none;
    }
  }
`;