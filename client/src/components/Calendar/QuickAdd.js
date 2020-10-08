import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import styled from "styled-components";

import { CREATE_RUN } from "../../graphql/mutations";
import { GET_RUNS, GET_PROFILE_CONTENT } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";
import { getMonthStr } from "./helpers";
import {
  BigButton, 
  InputContainer,
  FormLabel, 
  TextInput, 
  ModalCard, 
  FlexContainer, 
  StyledSelect, 
  Units 
} from "../../elements";
import { colors } from "../../styles";

const QuickAdd = ({ toggle, timestamp }) => {
  const today = new Date();
  const fullDate = new Date(timestamp);
  const completed = today >= fullDate;
  const month = getMonthStr(fullDate.getMonth());

  const { register, handleSubmit, errors, setValue, watch } = useForm();
  const watchSeconds = watch("elapsedSeconds");
  const watchMinutes = watch("elapsedMinutes");
  const watchHours = watch("elapsedHours");

  const value = useAuth();
  const { username } = value.viewerQuery.data.viewer.profile;

  const [createRun, { loading }] = useMutation(CREATE_RUN, {
    onCompleted: ({ createRun: { id } }) => {
      toggle();
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

  const calculateDuration = () => {
    const newDuration =
      watchSeconds * 1000
      + watchMinutes * 60 * 1000
      + watchHours * 60 * 60 * 1000;
    return newDuration;
  }

  const onSubmit = data => {
    const assignedTitle = `${Math.floor(data.distance)}km ${data.workoutType}`;
    const formattedData = {
      completed,
      distance: Number(data.distance),
      duration: Number(data.duration) || 0,
      start: fullDate.toISOString(),
      title: assignedTitle,
      username,
      workoutType: data.workoutType
    };

    createRun({
      variables: { data: formattedData }
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <ModalCard>
      <Heading>Quick add run</Heading>
      <Subheading>
        {`${month} ${fullDate.getDate()}, ${fullDate.getFullYear()}`}
      </Subheading>

      <form onSubmit={handleSubmit(onSubmit)}>
        <InputContainer>
          <FormLabel htmlFor="distance">Distance:</FormLabel>
          <TextInput
            type="number"
            id="distance"
            name="distance"
            min={0}
            placeholder="0.0"
            step="0.01"
            autoFocus
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

        { completed && (
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
                    positive: value => Number(value) > 0 
                  }
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

        <FlexContainer>
          <CancelButton type="button" onClick={toggle}>Cancel</CancelButton>
          <AddButton
            type="submit" 
            disabled={loading}
          >
            Add run
          </AddButton>
        </FlexContainer>
      </form>
    </ModalCard>
  );
};

export default QuickAdd;

const Heading = styled.h2`
  font-size: var(--step-2);
  font-weight: 600;
  margin-bottom: var(--step--1);
`;

const Subheading = styled.h3`
  font-size: var(--step-1);
  font-weight: 600;
  margin-bottom: var(--step-2);
`;

const AddButton = styled(BigButton)`
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