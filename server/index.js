import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { Neo4jGraphQL } from "@neo4j/graphql";
import neo4j from "neo4j-driver";

/*

MOVIE{title:String}     <-[:ACTED_IN]-       Actor{name:String}

    @: directive
*/

const typeDefs = `#graphql
 
 type Movie {
        title: String
        description: String
        year: Int
        runtime: Int
        rating: Float
        votes: Int
        revenue: Float
        actorsIn: [Actor!]! @relationship(type: "ACTED_IN", direction: IN)
        directedBy: [Director!]! @relationship(type: "DIRECTED", direction: IN)
        genres: [Genre!]! @relationship(type: "IN", direction: OUT)
    }

    type Actor {
        name: String
        moviesIn: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
        directedMovies: [Movie!]! @relationship(type: "DIRECTED", direction: OUT)
    }

    type Director {
        name: String
        moviesDirected: [Movie!]! @relationship(type: "DIRECTED", direction: OUT)
    }

    type Genre {
        genre: String
        moviesInGenre: [Movie!]! @relationship(type: "IN", direction: IN)
    }
`;

const driver = neo4j.driver("neo4j+s://46b87d8b.databases.neo4j.io", neo4j.auth.basic("neo4j", "zEfS02UU9Ps_K3kom6EVREUph1EC8K5HdUve40SvC4Q"));

const neoShema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
  schema: await neoShema.getSchema(),
});

const { url } = await startStandaloneServer(server, {
  context: async ({ req }) => ({ req }),
  listen: { port: 4000 },
});

console.log(`server ready at ${url}`);
