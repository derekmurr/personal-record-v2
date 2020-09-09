import React from "react";
import { useQuery } from "@apollo/client";
import styled from "styled-components";

import { GET_RUNS_BY_DATE_RANGE } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";
import Loader from "../Loader";
import { colors } from "../../styles";

const CalendarView = () => {
  const value = useAuth();
  const { username } = value.viewerQuery.data.viewer.profile;

  const { data, loading } = useQuery(GET_RUNS_BY_DATE_RANGE, {
    variables: {
      query: { 
        username,
        startDate: "2020-08-31T19:26:11.000Z",
        endDate: "2020-09-05T19:25:18.891Z"
      }
    }
  });

  if (loading) {
    return <Loader />
  }

  return (
    <StyledSection>
      <h2>Calendar component</h2>
      <ul>
        {data.runsByDateRange.edges.map(({ node }) => (
          <li key={node.id}><p>{node.distance}</p><p>{node.start}</p></li>
        ))}
      </ul>
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