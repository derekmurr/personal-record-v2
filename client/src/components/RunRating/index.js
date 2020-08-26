import React from "react";
import { PieChart, Pie } from "recharts";
import styled from "styled-components";
import { colors } from "../../styles";

const RunRating = ({ number, heading }) => {
  const ratingColors = {
    1: colors.danger,
    2: colors.intervals,
    3: colors.hills,
    4: colors.easy,
    5: colors.confirm
  };

  const ratingData = [];

  for (let i = 1; i <= 5; i++) {
    ratingData.push({ name: `${i}`, value: 1, fill: i <= number ? ratingColors[i] : "#171F26" })
  }

  return (
    <div>
      <RatingHeader>{heading}</RatingHeader>
      <RatingContainer ratingcolor={ratingColors[number]}>
        <RatingNumber>{number}</RatingNumber>
        <PieChart width={60} height={60}>
          <Pie data={ratingData} dataKey="value" cx="50%" cy="50%" outerRadius={29} innerRadius={19} stroke="#171F26" startAngle={90} endAngle={450} />
        </PieChart>
      </RatingContainer>
    </div>
  );
}

export default RunRating;

const RatingHeader = styled.h4`
  font-family: var(--font-condensed);
  font-weight: 100;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: var(--step--1);
  margin-bottom: 1.4rem;
`;

const RatingContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: ${colors.backgroundDark};
  --ratingcolor: ${props => props.ratingcolor};
  > * {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }
`;

const RatingNumber = styled.p`
  font-family: var(--font-heading);
  font-size: var(--step-4);
  font-weight: 800;
  margin: -2px 0 0 -2px;
  color: var(--ratingcolor);
`;
