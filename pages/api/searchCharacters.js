import { ApolloClient, InMemoryCache, gql } from "@apollo/client";


const APIURL = "https://rickandmortyapi.com/graphql/";

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

export default async (req, res)=>{
  const search = req.body;
  try{
    const {data} = await client.query({
      query: gql`
        query {
    characters(filter: {name :"${search}"}){
      info{
        count
        pages
      }
    	results{
        name
        id
        location{
          id
          name
        }
        origin{
          id
          name
        }
        episode{
          id
          episode
          air_date
        }
        image
      }
    }
}
      `
    });
res.status(200).json({characters: data.characters.results, error: null});
  } catch(error){
    if(error.message === "404: Not Found"){
      res.status(404).json({characters: null, error: "No Character Found"})
    }else{
     res.status(500).json({characters: null, error: "Internal Error, please try again"}) 
    }
  }
}