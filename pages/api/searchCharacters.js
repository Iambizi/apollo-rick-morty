import { ApolloClient, InMemoryCache, gql } from "@apollo/client";


const APIURL = "https://rickandmortyapi.com/graphql/";

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});