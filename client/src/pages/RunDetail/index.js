import React from "react";
import { Route, Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import moment from "moment";
import styled from "styled-components";
import { AiOutlineCalendar } from "react-icons/ai";

import { GET_RUN } from "../../graphql/queries";

import DeleteRun from "../../components/DeleteRun";
import Loader from "../../components/Loader";
import MainLayout from "../../layouts/MainLayout";
import Modal from "../../components/Modal";
import NotFound from "../NotFound";
import RunRating from "../../components/RunRating";
import RunType from "../../components/RunType";
import RunWeather from "../../components/RunWeather";
import SubNav from "../../components/SubNav";
import { Toggle } from "../../utilities";

import { TitleBlock, BigNumbers, Units, RunDetailSubhead } from "../../elements";
import { colors, breakpoints } from "../../styles";

const RunDetail = ({ match }) => {
  const { data, loading } = useQuery(GET_RUN, {
    variables: {
      id: match.params.runId
    }
  });

  if (loading) {
    return (
      <MainLayout>
        <SubNav />
        <TitleBlock>
          <h1>Detail</h1>
        </TitleBlock>
        <Loader />
      </MainLayout>
    );
  } else if (data && data.run) {
    const { run } = data;

    let totalSeconds = Math.floor((run.duration / 1000) % 60);
    let totalMinutes = Math.floor((run.duration / (1000 * 60)) % 60);
    let totalHours = Math.floor((run.duration / (1000 * 60 * 60)) % 24);

    const pace = (run.duration / 1000) / run.distance;
    const paceMinutes = Math.floor(pace / 60);
    const paceSeconds = Math.round(pace % 60);

    totalHours = (totalHours < 10) ? "0" + totalHours : totalHours;
    totalMinutes = (totalMinutes < 10) ? "0" + totalMinutes : totalMinutes;
    totalSeconds = (totalSeconds < 10) ? "0" + totalSeconds : totalSeconds;

    let displayDistance = run.distance.toString();
    if (displayDistance && !displayDistance.includes('.')) {
      displayDistance = displayDistance + '.0';
    }

    return (
      <MainLayout>
        <SubNav />
        <TitleBlock>
          <h1>{run.title ? run.title : `${run.distance} ${run.workoutType}`}</h1>
        </TitleBlock>
  
        <RunDetailSection>
          <DateContainer>
            <AiOutlineCalendar />
            {run.completed ? (
              <h3>{moment(run.start).format("D MMMM YYYY, h:mm a")}</h3>
            ) : (
                <h3>{moment(run.start).format("D MMMM YYYY")}</h3>
              )}
          </DateContainer>

          <WeatherContainer>
            {run.tempInC && run.completed && (
              <p>{run.tempInC}°C</p>
            )}
            {run.weather.length > 0 && run.completed && (
              <WeatherList>
                {run.weather.map(condition => (
                  <li key={`weather-${condition}`} title={condition}>
                    <RunWeather weatherCondition={condition} />
                  </li>
                ))}
              </WeatherList>
            )}
            {run.completed === false && <p>This is a planned run.</p>}
          </WeatherContainer>

          <DistanceContainer>
            <RunDetailSubhead>Distance:</RunDetailSubhead>
            <BigNumbers>{displayDistance}</BigNumbers>
            <Units>km</Units>
          </DistanceContainer>

          {run.completed && (
            <DurationContainer>
              <RunDetailSubhead>Duration:</RunDetailSubhead>
              <BigNumbers>{`${totalHours}:${totalMinutes}:${totalSeconds}`}</BigNumbers>
              <Units>hh:mm:ss</Units>
            </DurationContainer>
          )}
          {run.completed && (
            <PaceContainer>
              <RunDetailSubhead>Pace:</RunDetailSubhead>
              <BigNumbers>
                {paceMinutes}:{paceSeconds < 10 ? `0${paceSeconds}` : paceSeconds}
              </BigNumbers>
              <Units>min/km</Units>
            </PaceContainer>
          )}

          <WorkoutTypeContainer>
            <RunDetailSubhead>Workout type:</RunDetailSubhead>
            <RunType runType={run.workoutType} />
          </WorkoutTypeContainer>

          {run.workoutType === 'Race' && run.completed && (
            <RaceInfoContainer>
              {run.racePosition && (
                <div>
                  <RunDetailSubhead>Position:</RunDetailSubhead>
                  <BigNumbers>{run.racePosition}</BigNumbers>
                  {run.raceFieldSize && <Units>out of {run.raceFieldSize}</Units>}
                </div>

              )}
              {run.raceAgePosition && (
                <div>
                  <RunDetailSubhead>Age group:</RunDetailSubhead>
                  <BigNumbers>{run.raceAgePosition}</BigNumbers>
                  {run.raceAgeFieldSize && <Units>out of {run.raceAgeFieldSize}</Units>}
                </div>
              )}
            </RaceInfoContainer>
          )}

          {(run.effort && run.completed) || (run.rating && run.completed) ? (
            <EffortRatingContainer>
              {run.effort && <RunRating number={run.effort} heading='effort' />}
              {run.rating && <RunRating number={run.rating} heading='rating' />}
            </EffortRatingContainer>
          ) : (null)}

          {run.treadmill && run.completed && (
            <TreadmillContainer><p>Treadmill run</p></TreadmillContainer>
          )}

          {run.notes && (
            <NotesContainer>
              <RunDetailSubhead>Notes:</RunDetailSubhead>
              <p>{run.notes}</p>
            </NotesContainer>
          )}

          <EditDeleteContainer>
            <Toggle>
              {({ on, toggle }) => (
                <>
                  <button type='button' onClick={toggle}>Delete run</button>
                  <Modal on={on} toggle={toggle}>
                    <DeleteRun toggle={toggle} runId={run.id} />
                  </Modal>
                </>
              )}
            </Toggle>

            <Link to={`/runs/${run.id}/edit`}>Edit run</Link>
          </EditDeleteContainer>
        </RunDetailSection>
      </MainLayout>
    );
  }

  return <Route component={NotFound} />

};

export default RunDetail;

const RunDetailSection = styled.section`
  padding: 8rem 0;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2rem;

  @media(max-width: ${breakpoints.mobilemed}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const EditDeleteContainer = styled.div`
  margin-top: 6rem;
  grid-column: 1 / -1;

  button:first-of-type {
    margin-right: 2rem;
  }
`;

const DateContainer = styled.div`
  grid-column: 1 / 2;
  display: flex;
  align-items: center;

  > * {
    margin-block: 0;
  }
  svg {
    font-size: 2.4rem;
    margin-inline-end: 2.4rem;
  }

  @media(max-width: ${breakpoints.tablet}) {
    grid-column: 1 / -1;
  }
`;

const WeatherContainer = styled.div`
  grid-column: 2 / -1;
  display: flex;
  align-items: center;

  p {
    font-weight: 800;
    font-size: 2.4rem;
    margin-inline-end: 3rem;
    margin-block: 0;
  }

  @media(max-width: ${breakpoints.tablet}) {
    grid-column: 1 / -1;
  }
`;

const WeatherList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;

  li {
    margin-block-start: 0;
    margin-block-end: -6px;
    margin-inline-end: 3rem;
    font-size: 3.4rem;
  }
`;

const RaceInfoContainer = styled.div`
  grid-column: 1 / -1;
  grid-row-start: 5;
  display: flex;

  & > div:first-of-type {
    margin-inline-end: 6rem;
  }

  @media(max-width: ${breakpoints.tablet}) {
    grid-row-start: 6;
  }
  @media(max-width: ${breakpoints.mobilemed}) {
    grid-column: 1 / -1;
    grid-row-start: 7;
  }
  @media(max-width: ${breakpoints.mobilesmall}) {
    grid-row: 8 / 9;
  }
`;

const EffortRatingContainer = styled.div`
  grid-column: 2 / -1;
  display: flex;

  & > div:first-of-type {
    margin-inline-end: 6rem;
  }

  @media(max-width: ${breakpoints.mobilemed}) {
    grid-column: 2 / -1;
    grid-row: 5 / 6;
  }
  @media(max-width: ${breakpoints.mobilesmall}) {
    grid-column: 1 / -1;
    grid-row: 6 / 7;
  }
`;

const TreadmillContainer = styled.div`
  padding-top: 3.2rem;
  grid-column: 1 / -1;

  p {
    font-size: 1.8rem;
    font-weight: 100;
    margin-top: -0.4rem;
  }
`;

const NotesContainer = styled.div`
  grid-column: 1 / -1;

  p {
    font-family: var(--font-condensed);
    font-size: 1.8rem;
    font-weight: 100;
    line-height: 1.6;
  }
`;

const DistanceContainer = styled.div`
  @media(max-width: ${breakpoints.mobilemed}) {
    grid-column: 1 / 2;
  }
`;

const DurationContainer = styled.div`
  @media(max-width: ${breakpoints.mobilemed}) {
    grid-column: 2 / -1;
  }
  @media(max-width: ${breakpoints.mobilesmall}) {
    grid-column: 1 / -1;
  }
`;

const PaceContainer = styled.div`
  @media(max-width: ${breakpoints.mobilemed}) {
    grid-column: 1 / 2;
    grid-row: 5 / 6;
  }
  @media(max-width: ${breakpoints.mobilesmall}) {
    grid-column: 2 / -1;
    grid-row: 4 / 5;
  }
`;

const WorkoutTypeContainer = styled.div`
  @media(max-width: ${breakpoints.mobilemed}) {
    grid-column: 1 / -1;
  }
  @media(max-width: ${breakpoints.mobilesmall}) {
    grid-row: 7 / 8;
  }
`;