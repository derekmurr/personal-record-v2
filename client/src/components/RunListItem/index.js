import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { AiOutlineEdit } from "react-icons/ai";

import { colors, breakpoints } from "../../styles";

const RunListItem = ({ run }) => {
  const runcolor = run.workoutType === 'Default' ? colors.defaultColor : colors[run.workoutType.toLowerCase()];

  return (
    <ListRow>
      <Link to={`/runs/${run.id}`}>
        <ListText>
          <RunTitle>{run.title ? run.title : `${Math.floor(run.distance)}km ${run.workoutType} Run`}</RunTitle>
          <p>{moment(run.start).format("D MMMM YYYY")}</p>
          <p>{run.distance}km</p>
          <RunType runcolor={runcolor}>{run.workoutType}</RunType>
        </ListText>
      </Link>

      <EditDiv>
        <Link to={`/runs/${run.id}/edit`}>
          <AiOutlineEdit aria-label="Edit"/>
          <span>Edit run</span>
        </Link>
      </EditDiv>
    </ListRow>
  );
};

export default RunListItem;

const ListRow = styled.li`
  border-bottom: 1px solid ${colors.white};
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;

  > a {
    width: 100%;
    flex-grow: 1;
    text-decoration-color: transparent;
    transition: text-decoration-color 0.3s ease;
  }

  > a:hover,
  > a:focus {
    outline: none;
    color: ${colors.white};
    text-decoration-color: ${colors.white};
  }

  &:hover,
  &:focus-within {
    background-color: ${colors.backgroundDark};
  }
`;

const ListText = styled.div`
  font-family: var(--font-condensed);
  font-size: 1.8rem;
  color: ${colors.white};
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 1.4rem 1rem;

  & > * {
    padding-inline-end: 1.4rem;
  }

  > * {
    justify-self: start;
  }

  @media(max-width: ${breakpoints.mobile}) {
    font-size: 1.4rem;
  }
`;

const RunTitle = styled.h2`
  flex-basis: 100%;
  font-size: 2rem;
  margin-bottom: 1rem;
`;

const RunType = styled.p`
  position: relative;
  margin-left: 1.8rem;
  --color: ${props => props.runcolor};

  &::after {
    position: absolute;
    content: '';
    width: 0.8rem;
    height: 0.8rem;
    border-radius: 50%;
    right: calc(100% + 1rem);
    top: calc(50% - 0.4rem);
    background-color: var(--color);
  }
`;

const EditDiv = styled.div`
  color: ${colors.linkPrimary};
  flex-shrink: 0;
  font-size: 2rem;
  padding: 0;
  margin-right: 1rem;
  
  & > a {
    padding: 1rem;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    border: 1px solid transparent
    display: flex;
    align-items: center;
    transition: border 0.3s ease, text-decoration-color 0.3s ease, color 0.3s ease;

    &:focus,
    &:hover {
      color: ${colors.white};
      text-decoration-color: ${colors.white};
      outline: none;
      border: 1px solid ${colors.linkPrimary};
    }
  }

  & span {
    font-size: 1.4rem;
    margin-inline-start: 1rem;
  }

  @media(max-width: ${breakpoints.mobile}) {
    & span {
      display: none;
    }
  }
`;