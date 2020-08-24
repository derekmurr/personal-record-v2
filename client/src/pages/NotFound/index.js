import React from "react";

import MainLayout from "../../layouts/MainLayout";
import { TitleBlock } from "../../elements";

const NotFound = () => {
  return (
    <MainLayout>
      <TitleBlock>
        <h1>404.</h1>
      </TitleBlock>
      <p>File not found. Sorry.</p>
    </MainLayout>
  );
};

export default NotFound;
