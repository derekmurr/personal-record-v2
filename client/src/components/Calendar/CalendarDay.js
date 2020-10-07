import React from "react";
import styled from "styled-components";
import { BiAddToQueue } from "react-icons/bi";

import Event from "./Event";
import Modal from "../../components/Modal";
import QuickAdd from "./QuickAdd";
import { Toggle } from "../../utilities";
import { colors } from "../../styles";

const CalendarDay = ({ day, setSelectedDay }) => {
  return (
    <DayBox dark={day.month !== 0}>
      <DateContainer>
        {day.date}
      </DateContainer>
      <EventContainer>
        {day.runs?.map((run, i) => (
          <Event 
            run={run} 
            key={`day${day.date}-run${i}`}
          />
        ))}
        <Toggle>
          {({ on, toggle }) => (
            <>
              <QuickAddButton
                type='button'
                onClick={() => {
                  window.scroll(0, 0);
                  toggle();
                }
                }>
                <span className="icon"><BiAddToQueue aria-hidden={true} /></span>
                <span className="text">Quick add run</span>
              </QuickAddButton>
              <Modal on={on} toggle={toggle}>
                <QuickAdd
                  toggle={toggle}
                  timestamp={day.timestamp} />
              </Modal>
            </>
          )}
        </Toggle>
      </EventContainer>
      <TouchOverlay onClick={() => setSelectedDay(day)}>
      </TouchOverlay>
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
`;

const EventContainer = styled.div`
  position: absolute;
  top: 22px;
  left: 4px;
  right: 4px;
  bottom: 4px;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  a:focus,
  a:hover {
    outline: 2px solid ${colors.primary};
  }
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
    filter: brightness(120%) saturate(120%);
  }
`;

const TouchOverlay = styled.div`
  display: none;
  
  @media (max-width: 675px) {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`;

const QuickAddButton = styled.button`
  appearance: none;
  background-color: transparent;
  border: none;
  margin: 0;
  padding: 0;
  flex-grow: 1;
  color: ${colors.defaultColor};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  span {
    display: block;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  .icon {
    font-size: var(--step-2);
  }
  .text {
    font-size: var(--step--1);
    font-family: var(--font-condensed);
    line-height: 1;
  }

  &:focus {
    outline: 0;
  }

  &:hover span,
  &:focus span {
    opacity: 1;
  }

  @media (max-width: 675px) {
    display: none;
  }
`;
