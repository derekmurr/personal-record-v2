import React, { useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import styled from "styled-components";

import { getMonthStr } from "./helpers";
import CalendarDay from "./CalendarDay";
import MobileDay from "./MobileDay";
import { LittleButton } from "../../elements";
import { colors } from "../../styles";

const CalendarMonth = ({ 
  monthArray, 
  currentMonth, 
  currentYear, 
  setNewMonth, 
  startDate, 
  endDate 
}) => {
  const [ selectedDay, setSelectedDay ] = useState();

  return (
    <CalendarSection>
      <MonthHeader>
        <h3>{`${getMonthStr(currentMonth)} ${currentYear}`}</h3>
        <ButtonContainer>
          <PrevNextButton
            type="button"
            onClick={() => setNewMonth(-1)}
          >
            <AiOutlineLeft />
          </PrevNextButton>
          <PrevNextButton
            type="button"
            onClick={() => setNewMonth(1)}
          >
            <AiOutlineRight />
          </PrevNextButton>
        </ButtonContainer>
      </MonthHeader>
      <WeekContainer>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
          <WeekdayHeader key={`weekdayheader${i}`}>{d}</WeekdayHeader>
        ))}
      </WeekContainer>
      <WeekContainer>
        {monthArray?.map((day, index) => (
        <CalendarDay 
          key={`day${index}`} 
          day={day} 
          setSelectedDay={setSelectedDay} 
        />
        ))}
      </WeekContainer>
      <MobileDay selectedDay={selectedDay, startDate, endDate} />
    </CalendarSection>
  );
};

export default CalendarMonth;

const CalendarSection = styled.section`
  padding: 10px 0;

  @media (max-width: 768px) {
    padding: 0;
  } 
`;

const WeekContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
`;

const MonthHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding-bottom: var(--step-0);

  h3 {
    font-size: var(--step-0);
    font-weight: 600;
  }
`;

const WeekdayHeader = styled.div`
  border-bottom: 1px solid ${colors.primary};
  font-size: var(--step-0);
  font-weight: 600;
  padding: 0.5rem;
  text-align: center;
`;

const PrevNextButton = styled(LittleButton)`
  background-color: transparent;

  &:hover,
  &:focus {
    background-color: ${colors.primary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  > * + * {
    margin-left: 2rem;
  }
`;