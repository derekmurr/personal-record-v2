import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate: 360deg;
  }
`;

const StyledLoader = styled.div`
  width: 36px;
  height: 36px;

  svg {
    animation: ${rotate} 1.5s infinite;
    fill: rgba(255, 255, 255, 0.8);
  }
`;

export default StyledLoader;
