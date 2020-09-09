import React from "react";
import { BarChart, Bar, XAxis, YAxis, Legend, ResponsiveContainer } from "recharts";
import styled from "styled-components";

import { colors, breakpoints } from "../../styles";

const DailyDistances = ({ runData }) => {
  const today = new Date();

  // create an array of the last 14 days of data to graph, with 0 default distances for each
  const graphArray = [];
  for (let i = 0; i < 14; i++) {
    const runDate = new Date(new Date().setDate(today.getDate() - i));
    const name = `${runDate.getDate()}-${runDate.getMonth() + 1}-${runDate.getFullYear()}`;
    graphArray.push({
      name,
      default: 0,
      easy: 0,
      recovery: 0,
      hills: 0,
      tempo: 0,
      intervals: 0,
      long: 0,
      race: 0,
    })
  };

  // iterate through our filtered run array and add each distance to the appropriate day of our graph array
  // we're allowing for the fact that we can have more than one run per day
  for (let i = 0; i < runData.length; i++) {
    const runDate = new Date(runData[i].node.start);
    const name = `${runDate.getDate()}-${runDate.getMonth() + 1}-${runDate.getFullYear()}`;
    const index = graphArray.findIndex(run => run.name === name);
    const runType = runData[i].node.workoutType?.toLowerCase() || "default";
    const runDistance = runData[i].node.distance;
    if (index > -1) {
      graphArray[index][runType] = graphArray[index][runType] + runDistance;
    }
  }

  // reverse our graphArray so it's reverse-chronological
  const sortedRuns = graphArray.reverse();

  return (
    <StyledSection>
      <h2>Run distances</h2>
      <h3>Last 2 weeks</h3>
      <ResponsiveContainer height={300} width="100%">
        <BarChart
          data={sortedRuns}
          margin={{ top: 0, right: 30, left: -32, bottom: 5, }}
        >
          <XAxis dataKey="name" stroke={colors.white} fontFamily={'Roboto Condensed, sans-serif'} />
          <YAxis stroke={colors.white} fontFamily={'Roboto Condensed, sans-serif'} />
          <Bar dataKey="default" stackId="a" fill={colors.defaultColor} />
          <Bar dataKey="easy" stackId="a" fill={colors.easy} />
          <Bar dataKey="recovery" stackId="a" fill={colors.recovery} />
          <Bar dataKey="hills" stackId="a" fill={colors.hills} />
          <Bar dataKey="tempo" stackId="a" fill={colors.tempo} />
          <Bar dataKey="intervals" stackId="a" fill={colors.intervals} />
          <Bar dataKey="long" stackId="a" fill={colors.long} />
          <Bar dataKey="race" stackId="a" fill={colors.race} />
          <Legend
            verticalAlign='top'
            height={60}
            align='left'
            wrapperStyle={{ left: 0, top: -6, fontFamily: 'Roboto Condensed, sans-serif', width: '80%', lineHeight: '1.5' }}
          />
        </BarChart>
      </ResponsiveContainer>
    </StyledSection>
  );
};

export default DailyDistances;

const StyledSection = styled.section`
  min-width: 500px;

  h2 {
    font-size: var(--step-1);
    font-weight: 600;
    margin-bottom: var(--step-1);
  }

  h3 {
    font-size: var(--step-0);
    font-weight: 600;
    line-height: 1.5;
    margin-bottom: var(--step-2);
  }

  @media(max-width: ${breakpoints.mobile}) {
    min-width: 300px;
  }
`;
