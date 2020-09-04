import React from "react";
import { useQuery } from "@apollo/client";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { GET_PROFILE_CONTENT } from "../../graphql/queries";
import { updateFieldPageResults } from "../../lib/updateQueries";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import MainLayout from "../../layouts/MainLayout";
import RunList from "../../components/RunList";
import SubNav from "../../components/SubNav";
import { TitleBlock, LittleButton } from "../../elements";
import { colors } from "../../styles";


const ListView = () => {
  const value = useAuth();
  const { fullName, username } = value.viewerQuery.data.viewer.profile;

  const { data, fetchMore, loading } = useQuery(GET_PROFILE_CONTENT, {
    variables: {
      username
    }
  });

  if (loading) {
    return (
      <MainLayout>
        <SubNav />
        <TitleBlock>
          <h1>All runs</h1>
        </TitleBlock>
        <Loader />
      </MainLayout>
    )
  }

  const { runs } = data.profile;
  
  return (
    <MainLayout>
      <SubNav />
      <TitleBlock>
        <h1>{fullName ? `${fullName}'s ` : "All "} runs</h1>
        <StyledButton as={NavLink} to="/runs/add">Add new run</StyledButton>
      </TitleBlock>
      <RunList runData={runs.edges} username={username} />
      {runs.pageInfo.hasNextPage && (
        <button
          onClick={() => {
            fetchMore({
              variables: { cursor: runs.pageInfo.endCursor },
              updateQuery: (previousResult, { fetchMoreResult }) =>
                updateFieldPageResults(
                  "runs",
                  fetchMoreResult,
                  previousResult
                )
            })
          }}
        >
          Load more
        </button>
      )}
    </MainLayout>
  );
};

export default ListView;

const StyledButton = styled(LittleButton)`
  background-color: ${colors.secondary};

  &:hover,
  &:focus {
    background-color: ${colors.primary};
  }
`;