import React from "react";
import styled from "styled-components";

import { colors } from "../../styles";

const CalendarView = () => {
  return (
    <StyledSection>
      <h2>Calendar component</h2>
      <p>Placeholder.</p>
    </StyledSection>
  );
};

export default CalendarView;

const StyledSection = styled.section`
  padding: 2rem 0 4rem;

  p {
    font-size: var(--step-1);
    line-height: 1.5;
    margin-bottom: var(--step-0);
  }

  h2 {
    font-size: var(--step-1);
    font-weight: 600;
    margin-bottom: var(--step-2);
    padding-bottom: 1rem;
    border-bottom: 1px solid ${colors.primary};
  }
`;