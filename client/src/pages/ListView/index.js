import React from "react";
import { useQuery } from "@apollo/client";

import { GET_PROFILE_CONTENT } from "../../graphql/queries";
import { updateFieldPageResults } from "../../lib/updateQueries";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/Loader";
import MainLayout from "../../layouts/MainLayout";
import RunList from "../../components/RunList";
import SubNav from "../../components/SubNav";
import { TitleBlock } from "../../elements";


const ListView = () => {
  const value = useAuth();

  const { data, fetchMore, loading } = useQuery(GET_PROFILE_CONTENT, {
    variables: {
      username: value.viewerQuery.data.viewer.profile.username
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
  } else if (data) {
    const { runs } = data;
      return (
        <MainLayout>
          <SubNav />
          <TitleBlock>
            <h1>All runs</h1>
          </TitleBlock>
          <RunList runData={runs.edges} />
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
  } else {
    return (
      <p>hello</p>
    );
  }
};

export default ListView;
