import React, { useEffect, useState } from "react";
import { useQuery, useMutation, useLazyQuery } from "@apollo/client";
import { GET_MOVIES, CREATE_MOVIE, CHECK_ACTOR_EXISTENCE, CHECK_DIRECTOR_EXISTENCE, CHECK_GENRE_EXISTENCE, DELETE_MOVIE, UPDATE_MOVIE, CHECK_MOVIE_BY_TITLE } from "./queries";

function App() {
  const { loading, error, data } = useQuery(GET_MOVIES);
  const [createMovie] = useMutation(CREATE_MOVIE, {
    refetchQueries: [{ query: GET_MOVIES }],
  });
  const [checkActorExistence] = useLazyQuery(CHECK_ACTOR_EXISTENCE);
  const [checkGenreExistence] = useLazyQuery(CHECK_GENRE_EXISTENCE);
  const [checkDirectorExistence] = useLazyQuery(CHECK_DIRECTOR_EXISTENCE);
  const [checkMovieByTitle] = useLazyQuery(CHECK_MOVIE_BY_TITLE);
  const [searchMovieByTitle] = useLazyQuery(CHECK_MOVIE_BY_TITLE, {
    onCompleted: (data) => {
      setSearchedMovie(data?.movies?.[0] || null);
    },
    onError: () => {
      setSearchedMovie(null);
    },
  });

  const [updateMovie] = useMutation(UPDATE_MOVIE, {
    refetchQueries: [{ query: GET_MOVIES }],
  });

  const [deleteMovie] = useMutation(DELETE_MOVIE, {
    refetchQueries: [{ query: GET_MOVIES }],
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    year: 0,
    runtime: 0,
    rating: 0,
    votes: 0,
    revenue: 0,
    actors: "", // Direct input as a single string
    genres: "", // Direct input as a single string
    director: "", // Direct input as a single string
  });

  const [searchTitle, setSearchTitle] = useState("");
  const [searchedMovie, setSearchedMovie] = useState(null);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  }, [errorMessage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMovie({ ...newMovie, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { data: existingMovieData } = await checkMovieByTitle({
      variables: { title: newMovie.title },
    });

    if (existingMovieData?.movies?.length > 0 && !isEditing) {
      setErrorMessage("A movie with this title already exists.");
      return;
    } else {
      setErrorMessage(""); // Clear the error message if no conflict exists
    }

    // Check existence and prepare actors without any splitting
    const actors = await checkActorExistence({ variables: { name: newMovie.actors } }).then(({ data }) =>
      data?.actors.length ? { connect: { where: { node: { name: newMovie.actors } } } } : { create: { node: { name: newMovie.actors } } }
    );
    console.log(actors);

    // Check existence and prepare genres without any splitting
    const genres = await checkGenreExistence({ variables: { genre: newMovie.genres } }).then(({ data }) =>
      data?.genres.length ? { connect: { where: { node: { genre: newMovie.genres } } } } : { create: { node: { genre: newMovie.genres } } }
    );
    console.log(genres);
    // Check existence and prepare director without any splitting
    const directors = await checkDirectorExistence({ variables: { name: newMovie.director } }).then(({ data }) =>
      data?.directors.length ? { connect: { where: { node: { name: newMovie.director } } } } : { create: { node: { name: newMovie.director } } }
    );
    console.log(directors);

    if (isEditing) {
      // Update movie structure
      const updateMovieInput = {
        title: newMovie.title,
        description: newMovie.description,
        year: parseInt(newMovie.year),
        runtime: parseInt(newMovie.runtime),
        rating: parseFloat(newMovie.rating),
        votes: parseInt(newMovie.votes),
        revenue: parseFloat(newMovie.revenue),
        actorsIn: [{ disconnect: {} }, actors], // No array wrapping, already prepared for update
        genres: [{ disconnect: {} }, genres], // No array wrapping, already prepared for update
        directedBy: [{ disconnect: {} }, directors], // No array wrapping, already prepared for update
      };

      await updateMovie({ variables: { ...updateMovieInput } });
    } else {
      // Create movie structure
      const createMovieInput = {
        title: newMovie.title,
        description: newMovie.description,
        year: parseInt(newMovie.year),
        runtime: parseInt(newMovie.runtime),
        rating: parseFloat(newMovie.rating),
        votes: parseInt(newMovie.votes),
        revenue: parseFloat(newMovie.revenue),
        actorsIn: [actors], // Wrapped in array for creation format
        genres: [genres], // Wrapped in array for creation format
        directedBy: [directors], // No array wrapping, matches creation format
      };

      await createMovie({ variables: { input: [createMovieInput] } });
    }

    // Reset form after submission
    cleanForm();
    setIsEditing(false);
  };

  const cleanForm = () => {
    setNewMovie({
      title: "",
      description: "",
      year: "",
      runtime: "",
      rating: "",
      votes: "",
      revenue: "",
      actors: "",
      genres: "",
      director: "",
    });
  };

  const handleUpdate = (movie) => {
    console.log(movie);
    setNewMovie({
      title: movie.title,
      description: movie.description,
      year: movie.year,
      runtime: movie.runtime,
      rating: movie.rating,
      votes: movie.votes,
      revenue: movie.revenue,
      actors: movie.actorsIn?.map((actor) => actor.name).join(", "),
      genres: movie.genres?.map((genre) => genre.genre).join(", "),
      director: movie.directedBy?.map((director) => director.name).join(", "),
    });
    setIsEditing(true);
  };

  const handleDelete = (movie) => {
    deleteMovie({ variables: { title: movie.title } });
  };

  const handleSearchChange = (e) => {
    setSearchTitle(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchMovieByTitle({ variables: { title: searchTitle } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :</p>;

  return (
    <div>
      <h1>Movie App</h1>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <div>
        <h2>Search Movie By Title</h2>
        <form onSubmit={handleSearchSubmit}>
          <input type="text" placeholder="Enter movie title" value={searchTitle} onChange={handleSearchChange} />
          <button type="submit">Search</button>
        </form>

        {searchedMovie && (
          <ul>
            <li>
              <strong>Title:</strong> {searchedMovie.title}
              <ul>
                <li>
                  <strong>Description:</strong> {searchedMovie.description},<strong>Year:</strong> {searchedMovie.year}, <strong>Runtime:</strong> {searchedMovie.runtime},<strong>Rating:</strong>{" "}
                  {searchedMovie.rating}, <strong>Votes:</strong> {searchedMovie.votes}, <strong>Revenue:</strong> {searchedMovie.revenue}
                </li>
                <li>
                  <strong>Actors:</strong>{" "}
                  {searchedMovie.actorsIn?.length > 0 ? (
                    <span>
                      {searchedMovie.actorsIn.map((actor) => (
                        <span key={actor.name}>{actor.name}</span>
                      ))}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </li>
                <li>
                  <strong>Genres:</strong>{" "}
                  {searchedMovie.genres?.length > 0 ? (
                    <span>
                      {searchedMovie.genres.map((genre) => (
                        <span key={genre.genre}>{genre.genre}</span>
                      ))}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </li>
                <li>
                  <strong>Director:</strong>{" "}
                  {searchedMovie.directedBy?.length > 0 ? (
                    <span>
                      {searchedMovie.directedBy.map((director) => (
                        <span key={director.name}>{director.name}</span>
                      ))}
                    </span>
                  ) : (
                    "N/A"
                  )}
                </li>
              </ul>
            </li>
          </ul>
        )}
      </div>

      <hr></hr>
      <h2>Add/Update Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title: <input type="text" name="title" placeholder="Title" value={newMovie.title} onChange={handleInputChange} required disabled={isEditing} />
        </label>
        <br />
        <label>
          {" "}
          Description:
          <input type="text" name="description" placeholder="Description" value={newMovie.description} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          {" "}
          Year:
          <input type="number" name="year" placeholder="Year" value={newMovie.year} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          {" "}
          Runtime:
          <input type="number" name="runtime" placeholder="Runtime" value={newMovie.runtime} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          {" "}
          Rating:
          <input type="number" name="rating" placeholder="Rating" value={newMovie.rating} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          {" "}
          Votes:
          <input type="number" name="votes" placeholder="Votes" value={newMovie.votes} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          {" "}
          Revenue:
          <input type="number" name="revenue" placeholder="Revenue" value={newMovie.revenue} onChange={handleInputChange} />
        </label>
        <br />

        <label>
          {" "}
          Actors
          <input type="text" name="actors" placeholder="Actors" value={newMovie.actors} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          {" "}
          Genres
          <input type="text" name="genres" placeholder="Genres" value={newMovie.genres} onChange={handleInputChange} />
        </label>
        <br />

        <label>
          {" "}
          Director
          <input type="text" name="director" placeholder="Director" value={newMovie.director} onChange={handleInputChange} />
        </label>
        <br />

        <button type="submit">{isEditing ? "Update " : "Add"}</button>
        {isEditing && (
          <button
            type="button"
            onClick={() => {
              setIsEditing(false);
              cleanForm();
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Movie List</h2>

      <table border="1" cellPadding="10" cellSpacing="0">
        <thead>
          <tr>
            <th>Title</th>
            <th>Director</th>
            <th>Genres</th>
            <th>Actors</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.movies?.map((movie) => (
            <tr key={movie.title}>
              <td>{movie.title}</td>
              <td>{movie.directedBy ? movie.directedBy.name : "N/A"}</td>
              <td>
                <ul>
                  {movie.genres?.map((genre) => (
                    <li key={genre.genre}>{genre.genre}</li>
                  ))}
                </ul>
              </td>
              <td>
                <ul>
                  {movie.actorsIn?.map((actor) => (
                    <li key={actor.name}>{actor.name}</li>
                  ))}
                </ul>
              </td>
              <td>
                <button onClick={() => handleUpdate(movie)}>Update</button>
                <button onClick={() => handleDelete(movie)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
