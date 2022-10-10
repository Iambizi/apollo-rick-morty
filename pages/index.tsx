import { GetStaticProps } from "next";
import { ApolloClient, InMemoryCache, gql } from "@apollo/client";
import React, { useState } from "react";
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
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";

interface Type {
  results: any;
}

const Home: React.FC<Type> = ({ results }): JSX.Element => {
  const initialState = results;

  const [characters, setCharacters] = useState(initialState);

  const [search, setSearch] = useState("");

  const toast = useToast();

  const handleSubmit = async (e) => {

    e.preventDefault();
    const results = await fetch("/api/searchCharacters", {
      method: "post",
      body: search,
    });
    const { characters, error } = await results.json();
    if (error) {
      toast({
        position: "bottom",
        title: "An error occured",
        description: error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setCharacters(characters);
    }

  };
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
          <form onSubmit={handleSubmit}>
            <Stack maxWidth="350px" width="100%" isInline mb={8}>
              <Input
                placeholder="Search"
                value={search}
                border="none"
                onChange={(e) => setSearch(e.target.value)}
              ></Input>
              <IconButton
                aria-label="Search Database"
                icon={<SearchIcon />}
                disabled={search === ""}
                type="submit"
              />
              <IconButton
                colorScheme="red"
                aria-label="Reset "
                icon={<CloseIcon />}
                disabled={search === ""}
                onClick={async () => {
                  setSearch("");
                  setCharacters(initialState);
                }}/>
            </Stack>
          </form>
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
