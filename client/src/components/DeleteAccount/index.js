import React from "react";
import { useMutation } from "@apollo/client";
import styled from "styled-components";

import { DELETE_ACCOUNT } from "../../graphql/mutations";
import { useAuth } from "../../context/AuthContext";
import { colors } from "../../styles";
import { BigButton, ModalCard, FlexContainer } from "../../elements";

const DeleteAccount = ({ toggle, accountId }) => {
  const { logout } = useAuth();
  const [deleteAccount, { loading }] = useMutation(DELETE_ACCOUNT, {
    onCompleted: logout
  });

  return (
    <ModalCard>
      <Heading>Delete account?</Heading>
      <Paragraph>
        Are you sure you want to permanently delete your account and all of its content? This cannot be undone.
      </Paragraph>
      <FlexContainer>
        <CancelButton onClick={toggle}>Cancel</CancelButton>
        <DeleteButton
          disabled={loading}
          onClick={() => {
            deleteAccount({
              variables: { where: { id: accountId } }
            });
          }}
        >
          Delete account
        </DeleteButton>
      </FlexContainer>
    </ModalCard>
  );
};

export default DeleteAccount;

const Heading = styled.h1`
  font-size: var(--step-2);
  font-weight: 600;
  margin-bottom: 2.4rem;
`;

const Paragraph = styled.p`
  font-size: var(--step-1);
  line-height: 1.5;
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