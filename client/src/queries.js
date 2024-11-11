import { gql } from "@apollo/client";

export const GET_MOVIES = gql`
  query Movies {
    movies {
      title
      description
      year
      runtime
      rating
      votes
      revenue
      actorsIn {
        name
      }
    }
  }
`;

export const CHECK_MOVIE_BY_TITLE = gql`
  query CheckMovieByTitle($title: String!) {
    movies(where: { title: $title }) {
      title
      description
      year
      runtime
      rating
      votes
      revenue
      actorsIn {
        name
      }
    }
  }
`;

export const CHECK_ACTOR_EXISTENCE = gql`
  query CheckActorExistence($name: String!) {
    actors(where: { name: $name }) {
      name
    }
  }
`;

export const CREATE_MOVIE = gql`
  mutation CreateMovie($input: [MovieCreateInput!]!) {
    createMovies(input: $input) {
      movies {
        title
        description
        year
        runtime
        rating
        votes
        revenue
        actorsIn {
          name
        }
      }
    }
  }
`;

export const UPDATE_MOVIE = gql`
  mutation UpdateMovie($title: String!, $description: String, $year: Int, $runtime: Int, $rating: Float, $votes: Int, $revenue: Float, $actorsIn: [MovieActorsInUpdateFieldInput!]) {
    updateMovies(where: { title: $title }, update: { description: $description, year: $year, runtime: $runtime, rating: $rating, votes: $votes, revenue: $revenue, actorsIn: $actorsIn }) {
      movies {
        title
        description
        year
        runtime
        rating
        votes
        revenue
      }
    }
  }
`;

export const DELETE_MOVIE = gql`
  mutation DeleteMovie($title: String!) {
    deleteMovies(where: { title: $title }) {
      nodesDeleted
    }
  }
`;
