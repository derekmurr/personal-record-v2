import React from "react";

import AddRunForm from "../../components/AddRunForm";
import MainLayout from "../../layouts/MainLayout";
import { TitleBlock } from "../../elements";

const AddRun = () => {
  return (
    <MainLayout>
      <TitleBlock>
        <h1>Add New Run</h1>
      </TitleBlock>
      <AddRunForm />
    </MainLayout>
  );
};

export default AddRun;
