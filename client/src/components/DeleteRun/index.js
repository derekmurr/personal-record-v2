import React from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { DELETE_RUN } from "../../graphql/mutations";
import { GET_RUNS, GET_PROFILE_CONTENT } from "../../graphql/queries";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../styles";
import { BigButton, ModalCard, FlexContainer } from "../../elements";

const DeleteRun = ({ toggle, runId }) => {
  const history = useHistory();
  const value = useAuth();
  const { username } = value.viewerQuery.data.viewer.profile;

  const onCompleted = () => {
    toggle();
    history.push("/list");
  };

  const [deleteRun, { loading }] = useMutation(DELETE_RUN, {
    onCompleted,
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

  return (
    <ModalCard>
      <Heading>Delete run?</Heading>
      <Paragraph>Are you sure? This cannot be undone.</Paragraph>
      <FlexContainer>
        <CancelButton onClick={toggle}>Cancel</CancelButton>
        <DeleteButton 
          disabled={loading} 
          onClick={() => {
            deleteRun({
              variables: { where: { id: runId } }
            }).catch(err => {
              console.log(err)
            });
          }}
        >
          Delete
        </DeleteButton>
      </FlexContainer>
    </ModalCard>
  );
};

export default DeleteRun;

const Heading = styled.h1`
  font-size: var(--step-2);
  font-weight: 600;
  margin-bottom: 2.4rem;
`;

const Paragraph = styled.p`
  font-size: var(--step-1);
  margin-bottom: 4.8rem;
`;

const DeleteButton = styled(BigButton)`
  background-color: ${colors.danger};

  &:hover,
  &:focus {
    background-color: ${colors.intervals};
  }
`;

const CancelButton = styled(BigButton)`
  background-color: ${colors.secondary};

  &:hover,
  &:focus {
    background-color: ${colors.primary};
  }
`;
