import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { CREATE_RUN } from "../../graphql/mutations";
import { GET_RUNS, GET_PROFILE_CONTENT } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";
import { 
  InputContainer, 
  FormLabel, 
  TextInput, 
  BigButton, 
  Checkbox,
  CheckboxLabel, 
  Units 
} from "../../elements";
import { colors, breakpoints } from "../../styles";

const AddRunForm = () => {
  const currentDateTime = new Date();
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

  const { register, handleSubmit, errors, formState } = useForm();

  const onSubmit = data => {
    const formattedData = {};

    createRun({
      variables: { data: formattedData },
      where: { username }
    }).catch(err => {
      console.log(err);
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Checkbox 
          type="checkbox" 
          name="completed" 
          id="completed"
          ref={register} />
        <CheckboxLabel htmlFor="completed">Has this run been completed?</CheckboxLabel>
        { formState.completed === false && (
          <p>This is a planned workout. More data can be entered once it is marked as completed.</p>
        )}
      </div>

      <InputContainer>
        <FormLabel htmlFor="distance">Distance:</FormLabel>
        <TextInput 
          type="number" 
          id="distance" 
          name="distance" 
          min={0} 
          placeholder="0.0" 
          step="0.01" 
          ref={register} 
          required />
        <Units>km</Units>
        {errors.distance?.type === "required" && (
          <ErrorText>This field is required!</ErrorText>
        )}
      </InputContainer>

      <div role="group" aria-labelledby="durlabel">
        <Legend id="durlabel">Run duraton:</Legend>
          <FlexLeft>
            <InputContainer>
              <TextInput
                type="number"
                id="elapsedHours"
                name="elapsedHours"
                min={0}
                max={12}
                placeholder="0"
                step="1"
                ref={register} />
              <FormLabel htmlFor="elapsedHours">hh</FormLabel>
            </InputContainer>
            <p>:</p>
            <InputContainer>
              <TextInput
                type="number"
                id="elapsedMinutes"
                name="elapsedMinutes"
                min={0}
                max={59}
                placeholder="0"
                step="1"
                ref={register}
                required />
              <FormLabel htmlFor="elapsedMinutes">mm</FormLabel>
            </InputContainer>
            <p>:</p>
            <InputContainer>
              <TextInput
                type="number"
                id="elapsedSeconds"
                name="elapsedSeconds"
                min={0}
                max={59}
                placeholder="0"
                step="1"
                ref={register}
                required />
              <FormLabel htmlFor="elapsedSeconds">ss</FormLabel>
            </InputContainer>
          </FlexLeft>
        {errors.elapsedMinutes?.type === "required" || errors.elapsedSeconds?.type === "required" && (
          <DurationError>
            <ErrorText>This field is required!</ErrorText>
          </DurationError>
        )}
      </div>

      <InputContainer>
          <FormLabel htmlFor="workoutType">Workout type:</FormLabel>
          <select name="workoutType" id="workoutType" ref={register}>
            <option value="defaultRun">Default</option>
            <option value="Easy">Easy</option>
            <option value="Recovery">Recovery</option>
            <option value="Hills">Hills</option>
            <option value="Tempo">Tempo</option>
            <option value="Intervals">Intervals</option>
            <option value="Long">Long</option>
            <option value="Race">Race</option>
          </select>
      </InputContainer>

      {formState.workoutType === "Race" && formState.completed === true && (
        <div role="group" aria-labelledby="raceLegend">
          <Legend id="raceLegend">Race finish position:</Legend>

          <FlexLeft>
            <InputContainer>
              <TextInput 
                type="number" 
                id="racePosition" 
                name="racePosition" 
                placeholder="1"
                step="1" 
                ref={register} />
              <FormLabel htmlFor="racePosition">Overall:</FormLabel>
            </InputContainer>

            <InputContainer>
              <TextInput 
                type="number" 
                id="raceFieldSize" 
                name="raceFieldSize" 
                placeholder="1"
                step="1" 
                ref={register} />
              <FormLabel htmlFor="raceFieldSize">Out of:</FormLabel>
            </InputContainer>

            <InputContainer>
              <TextInput 
                type="number" 
                id="raceAgeGroupPosition" 
                name="raceAgeGroupPosition" 
                placeholder="1"
                step="1" 
                ref={register} />
              <FormLabel htmlFor="raceAgeGroupPosition">Age Group:</FormLabel>
            </InputContainer>

            <InputContainer>
              <TextInput 
                type="number" 
                id="raceAgeGroupFieldSize" 
                name="raceAgeGroupFieldSize" 
                placeholder="1"
                step="1" 
                ref={register} />
              <FormLabel htmlFor="raceAgeGroupFieldSize">Out of:</FormLabel>
            </InputContainer>
          </FlexLeft>
        </div>
      )}

      <InputContainer>
        <FormLabel htmlFor="title">Workout name:</FormLabel>
        <TextInput 
          type="text"
          id="title" 
          name="title" 
          placeholder={`${formState.distance || 0}km ${formState.workoutType || "run"}`}
          ref={register} />
      </InputContainer>
      
      <SubmitButton type="submit" disabled={loading}>
        Add run
      </SubmitButton>
    </form>
  );
};

export default AddRunForm;

const SubmitButton = styled(BigButton)`
  background-color: ${colors.confirm};

  &:hover,
  &:focus {
    background-color: ${colors.secondary};
  }
`;

const ErrorText = styled.p`
  color: ${colors.danger};
  font-size: var(--step--1);
  font-weight: 600;
`;

const FlexLeft = styled.div`
  display: flex;
  justify-content: flex-start;

  > * + * {
    margin-left: 1rem;
  }
`;

const DurationError = styled.div`
  flex-basis: 100%;
`;

const Legend = styled.p`
  font-size: var(--step--1);
  font-weight: 600;
  margin-bottom: 1rem;
`;