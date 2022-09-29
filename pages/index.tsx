import Head from "next/head";
import Image from "next/image";
import { GetStaticProps } from "next";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import React, { useEffect, useState } from "react";
import Characters from "../components/characters";
import {
  Heading,
  Box,
  Flex,
  Input,
  Stack,
  IconButton,
  useToast,
} from "@chakra-ui/react";

interface Type {
  results: any;
}

const Home: React.FC<Type> = ({ results }): JSX.Element => {
  const initialState = results;
  const [characters, setCharacters] = useState(initialState);

  // console.log(initialState);
  // console.log(results);
  // console.log(characters);
  return (
    <>
      <Flex direction="column" justify="center" align="center">
        <Box
          mb={4}
          flexDirection="column"
          align="center"
          justify="center"
          py={8}
        >
          <Heading as="h1" size="2xl" mb={8}>
            Rick and Morty
          </Heading>
          <Characters characters={characters} />
        </Box>
      </Flex>
    </>
  );
};

export default Home;

export async function getStaticProps(context) {
  const APIURL = "https://rickandmortyapi.com/graphql/";
  const client = new ApolloClient({
    uri: APIURL,
    cache: new InMemoryCache(),
  });

  const { data } = await client.query({
    query: gql`
      query {
        characters(page: 1) {
          info {
            count
            pages
          }
          results {
            name
            id
            location {
              id
              name
            }
            origin {
              id
              name
            }
            episode {
              id
              episode
              air_date
            }
            image
          }
        }
      }
    `,
  });

  return {
    props: {
      results: data.characters.results,
    },
  };
}
