import styled from 'styled-components';

import { colors, breakpoints } from "../styles";

export const TitleBlock = styled.div`
  margin-bottom: 6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid ${colors.primary};

  h1 {
    font-size: var(--step-2);
    font-weight: 600;
  }
`;

export const Wrapper = styled.div`
    margin: 0 auto;
    width: 95%;
    max-width: 1100px;
`;

export const GridWrapper = styled.div`
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 4% repeat(12, 1fr) 4%;
  grid-column-gap: 1%;

  @media(max-width: ${breakpoints.tablet}) {
    grid-template-columns: 4% repeat(8, 1fr) 4%;
    grid-column-gap: 1%;
  }

  @media(max-width: ${breakpoints.mobile}) {
    grid-template-columns: 3% repeat(6, 1fr) 3%;
    grid-column-gap: 2%;
  }
`;

export const FlexContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const BigNumbers = styled.p`
  font-family: var(--font-heading);
  font-weight: 800;
  font-size: var(--step-5);
  letter-spacing: 1px;
  margin-top: -0.8rem;
  margin-bottom: 0;
`;

export const Units = styled.p`
  font-size: var(--step-0);
  font-weight: 100;
  margin-top: 0.4rem;
`;

export const RunDetailSubhead = styled.h4`
  font-family: var(--font-condensed);
  font-weight: 100;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: var(--step--1);
  margin-bottom: 1.4rem;
`;

export const ModalCard = styled.div`
  background-color: ${colors.background};
  padding: 3.6rem 2.4rem;
  border-radius: 4px;
`;

export const BigButton = styled.button`
  appearance: none;
  border: none;
  border-radius: 4px;
  color: ${colors.white};
  cursor: pointer;
  font-family: var(--font-heading);
  font-size: var(--step-1);
  font-weight: 600;
  padding: 1rem 1.8rem;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: background-color 0.3s ease, text-decoration-color 0.3s ease;

  &:hover,
  &:focus {
    outline: none;
    text-decoration-color: ${colors.white};
  }
`;

export const LittleButton = styled(BigButton)`
  font-size: var(--step-0);
  padding: 0.8rem 1.2rem;
`;

export const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2.4rem;
`;

export const FormLabel = styled.label`
  font-size: var(--step--1);
  letter-spacing: 0.05rem;
  margin-bottom: 1rem;
  padding: 0;
`;

export const TextInput = styled.input`
  appearance: none;
  background-color: ${colors.backgroundDark};
  border: none;
  border-bottom: 3px solid ${colors.white};
  border-radius: 4px 4px 0 0;
  color: ${colors.white};
  font-family: var(--font-condensed);
  font-size: var(--step-0);
  letter-spacing: 0.05rem;
  margin-bottom: 0.5rem;
  padding: 1.25rem 0.5rem;
  width: 100%;

  &:focus {
    outline: 1px solid ${colors.primary};
  }

  &:invalid {
    border: none;
    box-shadow: none;
    border-bottom: 3px solid ${colors.danger};
  }
`;