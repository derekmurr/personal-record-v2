import React from "react";
import styled from "styled-components";

import { colors } from "../../styles";

const CalendarDay = ({ day }) => {
  return (
    <DayBox dark={day.month !== 0}>
      <DateContainer>
        {day.date}
      </DateContainer>
      {day.runs?.map((run, i) => (
        <p key={`day${day.date}-run${i}`}>{run.distance}</p>
      ))}
    </DayBox>
  );
};

export default CalendarDay;

const DateContainer = styled.span`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  font-size: var(--step--1);
  font-weight: 600;
  overflow: hidden;
`;

const DayBox = styled.div`
  position: relative;
  background-color: ${props => props.dark === true ? colors.backgroundDark : colors.background};
  border-left: 1px solid ${colors.defaultColor};
  border-bottom: 1px solid ${colors.defaultColor};

  &:nth-of-type(7n) {
    border-right: 1px solid ${colors.defaultColor};
  }

  &:before {
    content: "";
    display: block;
    padding-top: 100%;
  }

  &:hover,
  &:focus-within {
    box-shadow: inset 0px 0px 0px 2px ${colors.primary};
  }
`;