import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache
} from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { createPersistedQueryLink } from "apollo-link-persisted-queries";
import { onError } from "apollo-link-error";
import { setContext } from "@apollo/client/link/context";
import React from "react";

import { useAuth } from "../context/AuthContext";
import typePolicies from "./typePolicies";

// Pass our type policies to the InMemoryCache constructor
const cache = new InMemoryCache({ typePolicies });

// Apollo Client will need to call useAuth to obtain the access token,
// but we can only use hooks inside of function components. So we
// wrap the standard ApolloProvider component in a function component
// that can access this value by calling useAuth and then pass it
// through when instantiating a new ApolloClient. Also, to set the
// Authorization header with the access token for each GraphQL API
// request, we need to import the setContext function from Apollo Client.

// Takes in a getToken paramater and returns an ApolloClient object:
const createApolloClient = getToken => {
  // This is to allow Automatic Persisted Queries (APQs) to cache 
  // queries on the server, which improves efficiency
  const persistedQueryLink = createPersistedQueryLink();

  const uploadLink = createUploadLink({
    uri: process.env.REACT_APP_GRAPHQL_ENDPOINT
  });
  // A standard Apollo Client setup would use createHttpLink imported 
  // from @apollo/client, because it creates the typical terminating 
  // link for fetching data from a GraphQL endpoint over an HTTP conxn.
  // We need to use apollo-upload-client package instead, so we get 
  // support for multipart form requests, so we can upload files.

  // use the setContext function to create another link and set the
  // Authorization header with the access token, and pass through
  // any previously set headers as well.
  const authLink = setContext(async (request, { headers }) => {
    const accessToken = await getToken();
    return {
      headers: { ...headers, Authorization: `Bearer ${accessToken}` }
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ extensions: { serviceName }, message }) =>
        console.error(
          `[GraphQL error]: Message ${message}, Service: ${serviceName}`
        )
      );
    }
    if (networkError) {
      console.error(`[Network error]: ${networkError}`);
    }
  });

  return new ApolloClient({
    cache,
    link: ApolloLink.from([errorLink, persistedQueryLink, authLink, uploadLink])
  });
};

// Create an ApolloProviderWithAuth component that calls useAuth
// to extract getToken from this context, creates an Apollo Client
// with the createApolloClient function, then returns an 
// ApolloProvider component.
const ApolloProviderWithAuth = ({ children }) => {
  const { getToken } = useAuth();
  const client = createApolloClient(getToken);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

// We have to also export the createApolloClient function from this 
// file, in addition to the ApolloProviderWithAuth component, because
// we'll need a way to access an Apollo Client higher up in the
// component tree than the ApolloProvider will be.
export { createApolloClient };
export default ApolloProviderWithAuth;
