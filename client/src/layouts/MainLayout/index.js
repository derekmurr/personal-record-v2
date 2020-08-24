import React from "react";
import styled from "styled-components";

import Header from "../../components/Header";
import Footer from "../../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <SiteWrapper>
      <Header />
      <main id="main-content">
        {children}
      </main>
      <Footer />
    </SiteWrapper>
  );
};

export default MainLayout;

const SiteWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  header, footer {
    flex-grow: 0;
    flex-shrink: 0;
  }

  main {
    flex-grow: 1;
    margin: 0 auto;
    width: 95%;
    max-width: 1100px;
    padding-top: 4rem;
  }
`;
