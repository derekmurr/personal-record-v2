import React from "react";

import AddEditRunForm from "../../components/AddEditRunForm";
import MainLayout from "../../layouts/MainLayout";
import SubNav from "../../components/SubNav";
import { TitleBlock } from "../../elements";

const AddRun = () => {
  return (
    <MainLayout>
      <SubNav />
      <TitleBlock>
        <h1>Add new run</h1>
      </TitleBlock>
      <AddEditRunForm />
    </MainLayout>
  );
};

export default AddRun;
