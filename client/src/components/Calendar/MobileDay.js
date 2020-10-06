import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { getMonthStr } from "./helpers";
import { LittleButton } from "../../elements";
import Modal from "../../components/Modal";
import QuickAdd from "./QuickAdd";
import { Toggle } from "../../utilities";
import { colors } from "../../styles";

const MobileDay = ({ selectedDay, startDate, endDate }) => {
  const fullDate = new Date(selectedDay.timestamp);
  const month = getMonthStr(fullDate.getMonth());
  return (
    <DayContainer>
      <div>
        <h4>{`${month} ${fullDate.getDate()}, ${fullDate.getFullYear}`}</h4>
        {selectedDay.runs.length > 0 && (
          <ul>
            {selectedDay.runs.map(run => (
              <li>
                <Link to={`/runs/${run.id}`}>
                  {`${run.distance}km ${run.workoutType}`}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <Toggle>
          {({ on, toggle }) => (
            <>
              <QuickAddButton type='button' onClick={toggle}>Quick add</QuickAddButton>
              <Modal on={on} toggle={toggle}>
                <QuickAdd 
                  toggle={toggle} 
                  timestamp={selectedDay.timestamp}
                  startDate={startDate} 
                  endDate={endDate} />
              </Modal>
            </>
          )}
        </Toggle>
      </div>
    </DayContainer>
  );
};

export default MobileDay;

const DayContainer = styled.div`
  display: none;

  @media (max-width: 675px) {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      background-color: ${colors.backgroundDark};
      color: ${colors.white};
      padding: 2rem;

      h4 {
        font-size: var(--step-0);
        font-weight: 600;
        border-bottom: 1px solid ${colors.white};
        margin-bottom: var(--step-1);
        max-width: 300px;
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
        max-width: 300px;
      }

      li + li {
        margin-top: var(--step-0);
      }
    }
`;

const QuickAddButton = styled(LittleButton)`
  background-color: ${colors.primary};

  &:hover,
  &:focus {
    background-color: ${colors.secondary};
  }
`;