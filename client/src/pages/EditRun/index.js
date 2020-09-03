import React from "react";
import { Route, useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { GET_RUN } from "../../graphql/queries";

import AddEditRunForm from "../../components/AddEditRunForm";
import Loader from "../../components/Loader";
import MainLayout from "../../layouts/MainLayout";
import NotFound from "../NotFound";
import SubNav from "../../components/SubNav";
import { TitleBlock } from "../../elements";

const EditRun = () => {
  const location = useLocation();
  const urlArray = location.pathname.split("/");
  const runId = urlArray[urlArray.length - 1];

  const { data, loading } = useQuery(GET_RUN, {
    variables: {
      id: runId
    }
  });

  if (loading) {
    return (
      <MainLayout>
        <SubNav />
        <TitleBlock>
          <h1>Edit run</h1>
        </TitleBlock>
        <Loader />
      </MainLayout>
    );
  } else if (data && data.run) {
    const { run } = data;
    const defaultRun = { ...run };
  
    return (
      <MainLayout>
        <SubNav />
        <TitleBlock>
          <h1>Edit run</h1>
        </TitleBlock>
        <AddEditRunForm defaultRun={defaultRun} />
      </MainLayout>
    );
  }

  return <Route component={NotFound} />
};

export default EditRun;
