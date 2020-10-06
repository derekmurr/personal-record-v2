import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { getMonthStr } from "./helpers";
import { LittleButton } from "../../elements";
import Modal from "../../components/Modal";
import QuickAdd from "./QuickAdd";
import { Toggle } from "../../utilities";
import { colors } from "../../styles";

const MobileDay = ({ selectedDay }) => {
  const fullDate = new Date(selectedDay.timestamp);
  const month = getMonthStr(fullDate.getMonth());

  return (
    <DayContainer>
      <ListContainer>
        <h4>{`${month} ${fullDate.getDate()}, ${fullDate.getFullYear()}`}</h4>
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
      </ListContainer>
      <div>
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
                    Quick add
              </QuickAddButton>
              <Modal on={on} toggle={toggle}>
                <QuickAdd 
                  toggle={toggle} 
                  timestamp={selectedDay.timestamp} />
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
      border: 1px solid ${colors.defaultColor};
      border-top: none;
      color: ${colors.white};
      padding: 2rem;
    }
`;

const ListContainer = styled.div`
  width: 50%;
  max-width: 250px;

  h4 {
      font-size: var(--step-0);
      font-weight: 600;
      margin-bottom: var(--step-1);
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

  li a {
    color: ${colors.linkPrimary};
  }
`;

const QuickAddButton = styled(LittleButton)`
  background-color: ${colors.primary};

  &:hover,
  &:focus {
    background-color: ${colors.secondary};
  }
`;