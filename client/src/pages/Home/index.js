import React from "react";

import Dashboard from "../../components/Dashboard";
import MainLayout from "../../layouts/MainLayout";
import SubNav from "../../components/SubNav";

const Home = () => {  

  return (
    <MainLayout>
      <SubNav />
      <Dashboard />
    </MainLayout>
  );
};

export default Home;
