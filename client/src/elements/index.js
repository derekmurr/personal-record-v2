import styled from 'styled-components';

import { colors } from "../styles";

export const TitleBlock = styled.div`
  margin-bottom: 4rem;
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