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
      directedBy {
        name
      }
      genres {
        genre
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
      directedBy {
        name
      }
      genres {
        genre
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

export const CHECK_DIRECTOR_EXISTENCE = gql`
  query CheckDirectorExistence($name: String!) {
    directors(where: { name: $name }) {
      name
    }
  }
`;

export const CHECK_GENRE_EXISTENCE = gql`
  query CheckGenreExistence($genre: String!) {
    genres(where: { genre: $genre }) {
      genre
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
        directedBy {
          name
        }
        genres {
          genre
        }
      }
    }
  }
`;

export const CREATE_MOVIE_WITH_CONDITIONS = gql`
  mutation CreateMovieWithConditions($input: [MovieCreateInput!]!) {
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
        genres {
          genre
        }
        directors {
          name
        }
      }
    }
  }
`;

export const UPDATE_MOVIE = gql`
  mutation UpdateMovie(
    $title: String!
    $description: String
    $year: Int
    $runtime: Int
    $rating: Float
    $votes: Int
    $revenue: Float
    $actorsIn: [MovieActorsInUpdateFieldInput!]
    $genres: [MovieGenresUpdateFieldInput!]
    $directedBy: [MovieDirectedByUpdateFieldInput!]
  ) {
    updateMovies(
      where: { title: $title }
      update: { description: $description, year: $year, runtime: $runtime, rating: $rating, votes: $votes, revenue: $revenue, actorsIn: $actorsIn, genres: $genres, directedBy: $directedBy }
    ) {
      movies {
        title
        description
        year
        runtime
        rating
        votes
        revenue
        # actorsIn {
        #   name
        # }
        # genres {
        #   genre
        # }
        # directedBy {
        #   name
        # }
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
