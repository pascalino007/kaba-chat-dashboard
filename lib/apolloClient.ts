import { ApolloClient, InMemoryCache, createHttpLink, split } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";

// --- HTTP link ---
const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
});

// --- Auth middleware ---
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("jwt");
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    },
  };
});

// --- WebSocket link ---
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
    connectionParams: () => ({
      authorization: localStorage.getItem("jwt") || "",
    }),
  })
);

// --- Split for queries/mutations vs subscriptions ---
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

// --- Apollo Client ---
const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
