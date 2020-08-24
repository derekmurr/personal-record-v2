import React from "react";

import MainLayout from "../../layouts/MainLayout";
import SubNav from "../../components/SubNav";
import { TitleBlock } from "../../elements";

const CalendarView = () => {

  return (
    <MainLayout>
      <SubNav />
      <TitleBlock>
        <h1>Calendar</h1>
      </TitleBlock>

    </MainLayout>
  );
};

export default CalendarView;
