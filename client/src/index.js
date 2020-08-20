import { Router } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom";

import { AuthProvider } from "./context/AuthContext";
import ApolloProviderWithAuth from "./graphql/apollo";
import GlobalStyle from "./styles/global";
import history from "./routes/history";
import Routes from "./routes";

const App = () => (
  <AuthProvider>
    <ApolloProviderWithAuth>
      <GlobalStyle />
      <Router history={history}>
        <Routes />
      </Router>
    </ApolloProviderWithAuth>
  </AuthProvider>
);

ReactDOM.render(<App />, document.getElementById("root"));
