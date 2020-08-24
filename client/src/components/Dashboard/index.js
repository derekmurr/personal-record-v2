import React from "react";
import { NavLink } from "react-router-dom";

import { TitleBlock } from "../../elements";

const Dashboard = () => {
  return (
    <div>
      <TitleBlock>
        <h1>Dashboard</h1>
        <NavLink to="/runs/add">Add new run</NavLink>
      </TitleBlock>
      <div>
        <p>Daily Distances chart</p>
        <p>Planned runs list</p>
      </div>
    </div>
  );
};

export default Dashboard;
