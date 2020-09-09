import React from "react";
import { useQuery } from "@apollo/client";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { GET_RUNS_BY_DATE_RANGE } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";
import DailyDistances from "./DailyDistances";
import Loader from "../Loader";
import PlannedRuns from "./PlannedRuns";
import { TitleBlock, LittleButton } from "../../elements";
import { colors } from "../../styles";

const today = new Date();
const start = new Date().setDate(today.getDate() - 14);
const end = new Date().setDate(today.getDate() + 7);

const startDate = new Date(start).toISOString().toString();
const endDate = new Date(end).toISOString().toString();

const Dashboard = () => {
  const value = useAuth();
  const { username } = value.viewerQuery.data.viewer.profile;

  const { data, loading } = useQuery(GET_RUNS_BY_DATE_RANGE, {
    variables: {
      query: { username, startDate, endDate }
    },
    fetchPolicy: "no-cache"
  });

  if (loading) {
    return <Loader />
  }

  const rawResults = data.runsByDateRange.edges;

  // filter rawResults to get every non-completed run within the next 7 days
  const upcomingRuns = rawResults.filter(({ node }) => new Date(node.start) >= today && node.completed === false);

  // filter rawResults to get every completed run within the last 14 days
  const completedRuns = rawResults.filter(({ node }) => new Date(node.start) <= today && node.completed === true);

  // sort our run data arrays chronologically 
  const byDateAsc = (a, b) => new Date(a.node.start) - new Date(b.node.start);
  const sortedUpcomingRuns = upcomingRuns.sort(byDateAsc);

  return (
    <div>
      <TitleBlock>
        <h1>Dashboard</h1>
        <StyledButton as={Link} to="/runs/add">Add new run</StyledButton>
      </TitleBlock>

      <ChartBlock>
        <PlannedRuns runData={sortedUpcomingRuns} />
        <DailyDistances runData={completedRuns} />
      </ChartBlock>

    </div>
  );
};

export default Dashboard;

const StyledButton = styled(LittleButton)`
  background-color: ${colors.secondary};

  &:hover,
  &:focus {
    background-color: ${colors.primary};
  }
`;

const ChartBlock = styled.div`
  margin-top: 2rem;
  padding: 2rem 0;
  display: flex;
  flex-wrap: wrap;
`;