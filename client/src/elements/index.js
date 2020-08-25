import styled from 'styled-components';

import { colors } from "../styles";

export const TitleBlock = styled.div`
  margin-bottom: 6rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.primary};
`;

export const Wrapper = styled.div`
    margin: 0 auto;
    width: 95%;
    max-width: 1100px;
`;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const BigNumbers = styled.p`
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: 6rem;
  letter-spacing: 1px;
  margin-top: -0.8rem;
  margin-bottom: 0;

  @media(max-width: 749px) {
    font-size: 4.2rem;
  }
`;

export const Units = styled.p`
  font-size: 1.6rem;
  font-weight: 100;
  margin-top: -0.4rem;
`;

export const RunDetailSubhead = styled.h4`
  font-family: var(--font-condensed);
  font-weight: 100;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 1.4rem;
  margin-bottom: 1.4rem;
`;