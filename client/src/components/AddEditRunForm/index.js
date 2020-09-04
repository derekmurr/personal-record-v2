import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { CREATE_RUN, UPDATE_RUN } from "../../graphql/mutations";
import { GET_RUN, GET_RUNS, GET_PROFILE_CONTENT } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";
import { 
  InputContainer, 
  FormLabel, 
  TextInput, 
  BigButton, 
  Checkbox,
  CheckboxLabel, 
  Units, 
  StyledSelect 
} from "../../elements";
import { colors } from "../../styles";

const AddEditRunForm = ({ defaultRun }) => {
  const today = new Date();
  const defaultDate = defaultRun ? new Date(defaultRun.start) : today;
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [isInFuture, setIsInFuture] = useState(false);

  const history = useHistory();
  const value = useAuth();
  const { username } = value.viewerQuery.data.viewer.profile;

  const [createRun, { loading }] = useMutation(CREATE_RUN, {
    onCompleted: ({ createRun: { id } }) => {
      history.push(`/runs/${id}`);
    },
    refetchQueries: () => [
      {
        query: GET_RUNS,
        variables: {
          filter: { username }
        }
      },
      {
        query: GET_PROFILE_CONTENT,
        variables: { username }
      }
    ]
  });

  const [updateRun] = useMutation(UPDATE_RUN, {
    onCompleted: ({ updateRun: { id } }) => {
      history.push(`/runs/${id}`);
    },
    refetchQueries: () => [
      {
        query: GET_RUN,
        variables: {
          id: defaultRun.id
        }
      },
      {
        query: GET_RUNS,
        variables: {
          filter: { username }
        }
      },
      {
        query: GET_PROFILE_CONTENT,
        variables: { username }
      }
    ]
  });

  let defaultValues;
  if (!defaultRun) {
    defaultValues = {
      completed: true,
      elapsedHours: 0,
      elapsedMinutes: 0,
      elapsedSeconds: 0,
      distance: 0,
      duration: 0,
      startTime: today
    };
  } else {
    const startTime = new Date(defaultRun.start);
    let totalSeconds = Math.floor(defaultRun.duration / 1000);
    const elapsedHours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    const elapsedMinutes = Math.floor(totalSeconds / 60);
    const elapsedSeconds = totalSeconds % 60;

    defaultValues = { 
      ...defaultRun,
      elapsedSeconds, 
      elapsedMinutes, 
      elapsedHours,
      startTime
    };
  }

  const { register, handleSubmit, errors, formState, setValue, watch } = useForm({
    defaultValues
  });

  const watchCompleted = watch("completed");
  const watchWorkoutType = watch("workoutType");
  const watchDistance = watch("distance");
  const watchSeconds = watch("elapsedSeconds");
  const watchMinutes = watch("elapsedMinutes");
  const watchHours = watch("elapsedHours");

  const calculateDuration = () => {
    const newDuration = 
      watchSeconds * 1000 
      + watchMinutes * 60 * 1000 
      + watchHours * 60 * 60 * 1000;
    return newDuration;
  }

  useEffect(() => {
    if (selectedDate.getTime() > today.getTime()) {
      setValue("completed", false);
      setIsInFuture(true);
    } else {
      setValue("completed", true);
      setIsInFuture(false);
    }
  }, [selectedDate]);

  const onSubmit = data => {
    const weather = data.weather 
      ? data.weather.filter(item => item !== false)
      : [];
    const assignedTitle = data.title || `${Math.floor(data.distance)}km ${data.workoutType}`;

    const formattedData = {
      completed: data.completed,
      distance: Number(data.distance),
      duration: Number(data.duration) || 0,
      effort: data.effort && Number(data.effort),
      notes: data.notes && data.notes,
      racePosition: data.racePosition && Number(data.racePosition),
      raceFieldSize: data.raceFieldSize && Number(data.raceFieldSize),
      raceAgeGroupPosition: data.raceAgeGroupPosition && Number(data.raceAgeGroupPosition),
      raceAgeGroupFieldSize: data.raceAgeGroupFieldSize && Number(data.raceAgeGroupFieldSize),
      rating: data.rating && Number(data.rating),
      start: selectedDate.toISOString(),
      tempInC: data.tempInC ? Number(data.tempInC) : 0,
      title: assignedTitle,
      treadmill: data.treadmill,
      weather,
      workoutType: data.workoutType
    };
    
    if (!defaultRun) {
      formattedData.username = username;
    }

    if (!defaultRun) {
      createRun({
        variables: { data: formattedData }
      }).catch(err => {
        console.log(err);
      });
    } else {
      updateRun({
        variables: { 
          data: formattedData,
          where: { id: defaultRun.id }
        }
      }).catch(err => {
        console.log(err);
      });
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <CompletedContainer>
        <CheckboxContainer>
          <Checkbox 
            disabled={isInFuture} 
            type="checkbox" 
            name="completed" 
            id="completed"
            checked={formState.completed}
            ref={register} />
          <CheckboxLabel htmlFor="completed">Has this run been completed?</CheckboxLabel>
        </CheckboxContainer>
        {watchCompleted === false && (
          <CompletedPara>
            This is a planned workout. More data can be entered once it is marked as completed. Runs with a date in the future are automatically considered planned.
          </CompletedPara>
        )}
      </CompletedContainer>
      
      <FlexLeft>
        <InputContainer>
          <FormLabel htmlFor="distance">Distance:</FormLabel>
          <TextInput 
            type="number" 
            id="distance" 
            name="distance" 
            min={0} 
            placeholder="0.0" 
            step="0.01" 
            ref={register({
              validate: {
                positive: value => value > 0
              }
            })} 
            required />
          <Units>km</Units>
          {errors.distance?.type === "required" && (
            <ErrorText>This field is required!</ErrorText>
          )}
          {errors.distance?.type === "positive" && (
            <ErrorText>Distance must be greater than zero!</ErrorText>
          )}
        </InputContainer>

        <DateTimeContainer role="group" aria-labelledby="dateTimeLabel">
          <FormLabel as="p" id="dateTimeLabel">Date &amp; time:</FormLabel>
          <DatePicker
            selected={selectedDate}
            onChange={date => setSelectedDate(date)}
            timeInputLabel="Time:"
            dateFormat="MM/dd/yyyy h:mm aa"
            showTimeInput
          />
          <input type="hidden" ref={register} id="startTime" name="startTime" />
        </DateTimeContainer>
      </FlexLeft>

      {watchCompleted === true && (
        <div role="group" aria-labelledby="durlabel">
          <FormLabel as="p" id="durlabel">Run duration:</FormLabel>
            <FlexLeft>
              <InputContainer>
                <TextInput
                  type="number"
                  id="elapsedHours"
                  name="elapsedHours"
                  min={0}
                  max={12}
                  onChange={() => setValue("duration", calculateDuration())}
                  placeholder="0"
                  step="1"
                  ref={register} />
                <FormLabel htmlFor="elapsedHours">hh</FormLabel>
              </InputContainer>
              <span>:</span>
              <InputContainer>
                <TextInput
                  type="number"
                  id="elapsedMinutes"
                  name="elapsedMinutes"
                  min={0}
                  max={59} 
                  onChange={() => setValue("duration", calculateDuration())}
                  placeholder="0"
                  step="1"
                  ref={register}
                  required />
                <FormLabel htmlFor="elapsedMinutes">mm</FormLabel>
              </InputContainer>
              <span>:</span>
              <InputContainer>
                <TextInput
                  type="number"
                  id="elapsedSeconds"
                  name="elapsedSeconds"
                  min={0}
                  max={59}
                  onChange={() => setValue("duration", calculateDuration())}
                  placeholder="0"
                  step="1"
                  ref={register}
                  required />
                <FormLabel htmlFor="elapsedSeconds">ss</FormLabel>
              </InputContainer>
              <input 
                type="hidden" 
                id="duration" 
                name="duration" 
                ref={register(
                  { validate: {
                    positive: value => {
                      if (Number(value) > 0 && watchCompleted === true) {
                        return true;
                      } else if (watchCompleted === false) {
                        return true;
                      }
                      return false;
                    } }
                  }
                )} 
              />
            </FlexLeft>
            {errors.duration?.type === "positive" && (
              <ErrorText>A completed run's duration cannot be zero!</ErrorText>
            )}
        </div>
      )}

      <InputContainer>
          <FormLabel htmlFor="workoutType">Workout type:</FormLabel>
          <StyledSelect name="workoutType" id="workoutType" ref={register}>
            <option value="DefaultRun">Default</option>
            <option value="Easy">Easy</option>
            <option value="Recovery">Recovery</option>
            <option value="Hills">Hills</option>
            <option value="Tempo">Tempo</option>
            <option value="Intervals">Intervals</option>
            <option value="Long">Long</option>
            <option value="Race">Race</option>
        </StyledSelect>
      </InputContainer>

      {watchWorkoutType === "Race" && watchCompleted === true && (
        <div role="group" aria-labelledby="raceLegend">
          <FormLabel as="p" id="raceFormLabel">Race finish position:</FormLabel>

          <FlexLeftWide>
            <InputContainer>
              <TextInput 
                type="number" 
                id="racePosition" 
                name="racePosition" 
                placeholder="1"
                step="1" 
                ref={register} />
              <FormLabel htmlFor="racePosition">Overall</FormLabel>
            </InputContainer>

            <InputContainer>
              <TextInput 
                type="number" 
                id="raceFieldSize" 
                name="raceFieldSize" 
                placeholder="1"
                step="1" 
                ref={register} />
              <FormLabel htmlFor="raceFieldSize">Out of</FormLabel>
            </InputContainer>

            <InputContainer>
              <TextInput 
                type="number" 
                id="raceAgeGroupPosition" 
                name="raceAgeGroupPosition" 
                placeholder="1"
                step="1" 
                ref={register} />
              <FormLabel htmlFor="raceAgeGroupPosition">Age Group</FormLabel>
            </InputContainer>

            <InputContainer>
              <TextInput 
                type="number" 
                id="raceAgeGroupFieldSize" 
                name="raceAgeGroupFieldSize" 
                placeholder="1"
                step="1" 
                ref={register} />
              <FormLabel htmlFor="raceAgeGroupFieldSize">Out of</FormLabel>
            </InputContainer>
          </FlexLeftWide>
        </div>
      )}

      <InputContainer>
        <FormLabel htmlFor="title">Workout name:</FormLabel>
        <TextInput 
          type="text"
          id="title" 
          name="title" 
          placeholder={`${watchDistance || 0}km ${watchWorkoutType && watchWorkoutType !== "DefaultRun" ? watchWorkoutType : "run"}`}
          ref={register} />
      </InputContainer>

      {watchCompleted === true && (
        <FlexLeftWide>
          <InputContainer>
            <FormLabel htmlFor="effort">Effort (5 = max):</FormLabel>
            <StyledSelect name="effort" id="effort" ref={register}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </StyledSelect>
          </InputContainer>

          <InputContainer>
            <FormLabel htmlFor="rating">Rating (5 = best):</FormLabel>
            <StyledSelect name="rating" id="rating" ref={register}>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </StyledSelect>
          </InputContainer>
        </FlexLeftWide>
      )}

      {watchCompleted && (
        <TreadmillContainer>
          <Checkbox
            type="checkbox"
            name="treadmill"
            id="treadmill"
            ref={register} />
          <CheckboxLabel htmlFor="treadmill">Treadmill?</CheckboxLabel>
        </TreadmillContainer>
      )}

      {watchCompleted && (
        <FlexLeftWide>
          <InputContainer>
            <FormLabel htmlFor="tempInC">Temp (°C):</FormLabel>
            <TextInput
              type="number"
              id="tempInC"
              name="tempInC"
              placeholder="10"
              step={0.1}
              ref={register} />
          </InputContainer>
          <InputContainer>
            <FormLabel as="p" id="weather">Weather conditions:</FormLabel>
            <WeatherContainer role="group" aria-labelledby="weather">
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  name="weather[0]"
                  id="sunny"
                  value="SUNNY"
                  ref={register} />
                <CheckboxLabel htmlFor="sunny">Sunny</CheckboxLabel>
              </CheckboxContainer>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  name="weather[1]"
                  id="humid"
                  value="HUMID"
                  ref={register} />
                <CheckboxLabel htmlFor="humid">Humid</CheckboxLabel>
              </CheckboxContainer>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  name="weather[2]"
                  id="wind"
                  value="WIND"
                  ref={register} />
                <CheckboxLabel htmlFor="wind">Wind</CheckboxLabel>
              </CheckboxContainer>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  name="weather[3]"
                  id="rain"
                  value="RAIN"
                  ref={register} />
                <CheckboxLabel htmlFor="rain">Rain</CheckboxLabel>
              </CheckboxContainer>
              <CheckboxContainer>
                <Checkbox
                  type="checkbox"
                  name="weather[4]"
                  id="snow"
                  value="SNOW"
                  ref={register} />
                <CheckboxLabel htmlFor="snow">Snow</CheckboxLabel>
              </CheckboxContainer>
            </WeatherContainer>
          </InputContainer>
        </FlexLeftWide>
      )}

      <InputContainer>
        <FormLabel htmlFor="notes">Notes:</FormLabel>
        <TextInput 
          as="textarea"
          name="notes" 
          id="notes" 
          placeholder="Add notes here. What was the workout? How did it go? Did you see a dog?"
          ref={register}
        >
        </TextInput>
      </InputContainer>
      
      <ButtonContainer>
        <CancelButton type="button" onClick={() => history.goBack()}>
          Cancel
        </CancelButton>

        <SubmitButton type="submit" disabled={loading}>
          { defaultRun ? "Update run" : "Add run" }
        </SubmitButton>
      </ButtonContainer>
    </form>
  );
};

export default AddEditRunForm;

const SubmitButton = styled(BigButton)`
  background-color: ${colors.confirm};

  &:hover,
  &:focus {
    background-color: ${colors.secondary};
  }
`;

const CancelButton = styled(BigButton)`
  background-color: ${colors.secondary};

  &:hover,
  &:focus {
    background-color: ${colors.primary};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-top: 3.6rem;

  > * + * {
    margin-left: var(--step-5);
  }
`;

const ErrorText = styled.p`
  color: ${colors.danger};
  font-size: var(--step-0);
  font-weight: 600;
`;

const FlexLeft = styled.div`
  display: flex;
  justify-content: flex-start;

  > * + * {
    margin-left: var(--step-0);
  }

  span {
    position: relative;
    top: 10px;
  }
`;

const FlexLeftWide = styled(FlexLeft)`
  > * + * {
    margin-left: var(--step-5);
  }
`;

const WeatherContainer = styled(FlexLeft)`
  align-items: center;
  margin-top: 2rem;

  > * + * {
    margin-left: var(--step-2);
  }
`;

const CheckboxContainer = styled.div`
  position: relative;
`;

const DateTimeContainer = styled.div`
  flex-shrink: 0;
  margin-left: var(--step-4);

  input[type="text"] {
    appearance: none;
    background-color: ${colors.backgroundDark};
    border: 1px solid ${colors.white};
    border-radius: 4px;
    color: ${colors.white};
    font-family: var(--font-condensed);
    font-size: var(--step-0);
    letter-spacing: 0.05rem;
    margin-bottom: 0.5rem;
    padding: 1.25rem 0.5rem;
    text-align: center;

    &:focus,
    &:hover {
      outline: 1px solid ${colors.primary};
    }
  }

  .react-datepicker {
    color: ${colors.white};
    background-color: ${colors.backgroundDark};
    border: 1px solid ${colors.white};
    font-family: var(--font-condensed);
    font-size: var(--step-0);
  }
  .react-datepicker__header {
    background-color: ${colors.background};
  }
  .react-datepicker__current-month,
  .react-datepicker__day-name,
  .react-datepicker__day {
    color: ${colors.white};
  }
  .react-datepicker__current-month {
    font-size: var(--step--1);
    margin-bottom: 5px;
  }
  .react-datepicker__day,
  .react-datepicker__day-name {
    width: 2.4rem;
    line-height: 1.4;
  }
  .react-datepicker__day:hover {
    background-color: ${colors.secondary};
  }
  .react-datepicker__input-time-container {
    text-align: center;
    margin: 0 0 15px;

    input.react-datepicker-time__input {
      color: ${colors.white};
      background-color: ${colors.backgroundDark};
      border: 1px solid ${colors.white};
      font-size: var(--step--1);
      padding: 5px;
      text-algn: center;
      width: auto !important;
    }
  }
`;

const CompletedPara = styled.p`
  font-size: var(--step-0);
  letter-spacing: 0.05rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  padding: 0;
`;

const TreadmillContainer = styled(CheckboxContainer)`
  margin-bottom: var(--step-5);
`;

const CompletedContainer = styled(FlexLeft)`
  align-items: baseline;
  margin-bottom: var(--step-4);
  min-height: 60px;

  > div {
    flex-shrink: 0;
    margin-right: var(--step-4);
  }

  > p {
    flex-shrink: 1;
    margin-left: 0;
    margin-bottom: 0;
  }
`;