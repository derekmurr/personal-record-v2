import createAuth0Client from "@auth0/auth0-spa-js";
// The Auth0 SDK for single page apps is a lightweight option
// for integrating Auth0 with SPAs and it'll do the heavy
// lifting of handling token expiration and renewal.

import React, {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { createApolloClient } from "../graphql/apollo";
import { GET_VIEWER } from "../graphql/queries";
import history from "../routes/history";

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

// It's important to specify the GraphQL endpoint as an audience
// value in the options object passed to createAuth0Client, to
// ensure we receive an access token back from Auth0 in JWT format
const initOptions = {
  audience: process.env.REACT_APP_GRAPHQL_ENDPOINT,
  client_id: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  redirect_uri: process.env.REACT_APP_AUTH0_CALLBACK_URL
};

// We create an AuthContext and then create a useAuth wrapper
// function that returns the result of calling the useContext
// hook with the AuthContext object passed into it. The return
// value of useAuth will be the current value for AuthContext.
// The AuthProvider component will keep track of a few auth-
// related values in its state, and then set those values w/in
// the current context value. Other components will have access
// to the AuthContext whenever they need it, if we use the
// AuthProvider at the highest level in our component tree.

const AuthProvider = ({ children }) => {
  const [auth0Client, setAuth0Client] = useState();
  const [checkingSession, setCheckingSession] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [viewerQuery, setViewerQuery] = useState(null);

  useEffect(() => {
    const initializeAuth0 = async () => {
      try {
        const client = await createAuth0Client(initOptions);
        setAuth0Client(client);

        // Auth0 will add code & state query params to the 
        //  callback URL after a user enters their credentials
        if (window.location.search.includes("code=")) {
          await client.handleRedirectCallback();
          history.replace("/home");
        }

        const authenticated = await client.isAuthenticated();
        setIsAuthenticated(authenticated);

        // If no code query is appended to the URL and a user tries
        // to navigate to /login directly, then they get redirected
        // to either the / or /home route, depending on if they
        // are authenticated.
        if (history.location.pathname === "/login" && authenticated) {
          history.replace("/home");
        } else if (history.location.pathname === "/login") {
          history.replace("/");
        } else if (authenticated) {
          // AuthProvider sits above ApolloProviderWithAuth in the 
          // component tree, but it has to make the viewer query to
          // get user info, so we instantiate another ApolloClient here
          // to make the GET_VIEWER query
          const apolloClient = createApolloClient((...p) =>
            client.getTokenSilently(...p)
          );
          // Apollo Client's query method returns a promise, so we
          // call it with await. If it resolves successfully, we pass
          // the return value into setViewerQuery to update the state.
          const viewer = await apolloClient.query({ query: GET_VIEWER });
          setViewerQuery(viewer);
        }
      } catch {
        // If any errors during auth, send user back to index page
        history.location.pathname !== "/" && history.replace("/");
      } finally {
        setCheckingSession(false);
      }
    };
    // The function passed to useEffect cannot be made async, b/c
    // useEffect cannot return a promise, and async functions 
    // always return promises. We get around that by passing uE 
    // an anonymous function, then defining and immediately 
    // calling our async function inside that anon func. It needs
    // to be async so we can wait for our client object's methods
    // to resolve.
    initializeAuth0();
  }, []);

  // Pass an object to the AuthContext Provider's value prop,
  // including the checkingSession and isAuthenticated state
  // values, and two methods from the auth0Client to assist with
  // logging users in and out of the application.
  // We aren't storing tokens in cookies or localStorage for security
  // reasons; we'll rely on the token persisted in memory by the Auth0
  // client only, then hand that token off to Apollo Client as needed
  // for API requests. auth0Client's getTokenSilently method will
  // return a valid token if one exists, otherwise, it will invisibly 
  // open an iFrame with the Auth0 tenant's /authorize url to get a 
  // new token and return that instead.
  // We add the updateViewer function b/c we'll need access to it to
  // keep the viewer data in this context in sync with any mutations
  // that change the user's account or profile info.
  return (
    <AuthContext.Provider
      value={{
        checkingSession,
        getToken: (...p) => auth0Client.getTokenSilently(...p),
        isAuthenticated,
        login: (...p) => auth0Client.loginWithRedirect(...p),
        logout: (...p) => auth0Client.logout({
          ...p,
          returnTo: process.env.REACT_APP_AUTH0_LOGOUT_URL
        }),
        updateViewer: viewer =>
          setViewerQuery({ ...viewerQuery, data: { viewer } }),
        viewerQuery
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };
export default AuthContext;
