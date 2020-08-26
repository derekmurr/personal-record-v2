import React from "react";
import styled from "styled-components";

import { AiOutlineDashboard } from "react-icons/ai";
import { MdLocalHospital } from "react-icons/md";
import { IoMdTrophy, IoMdStopwatch } from "react-icons/io";
import { FaRunning, FaMountain, FaHourglassHalf } from "react-icons/fa";
import { GiFootprint } from "react-icons/gi";
import { colors } from "../../styles";

const RunTypeIndicator = ({ runType }) => {

  let icon, color;

  switch (runType) {
    case 'Easy':
      icon = <FaRunning />;
      color = colors.easy;
      break;
    case 'Recovery':
      icon = <MdLocalHospital />;
      color = colors.recovery;
      break;
    case 'Hills':
      icon = <FaMountain />
      color = colors.hills;
      break;
    case 'Tempo':
      icon = <AiOutlineDashboard />;
      color = colors.tempo;
      break;
    case 'Intervals':
      icon = <IoMdStopwatch />;
      color = colors.intervals;
      break;
    case 'Long':
      icon = <FaHourglassHalf />;
      color = colors.long;
      break;
    case 'Race':
      icon = <IoMdTrophy />;
      color = colors.race;
      break;
    default:
      icon = <GiFootprint />;
      color = colors.defaultColor;
  }

  return (
    <RunTypeContainer runcolor={color}>
      <IconWrapper>{icon}</IconWrapper>
      <RunTypeLabel>{runType}</RunTypeLabel>
    </RunTypeContainer>
  );
}

export default RunTypeIndicator;

const RunTypeContainer = styled.div`
  display: flex;
  align-items: center;
  --runcolor: ${props => props.runcolor};
`;

const RunTypeLabel = styled.p`
  font-family: var(--font-heading);
  font-size: var(--step-5);
  font-weight: 800;
  margin: 0;
`;

const IconWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  place-items: center;
  margin-inline-end: 2.4rem;
  color: var(--runcolor);

  svg {
    font-size: 4.2rem;
  }
`;