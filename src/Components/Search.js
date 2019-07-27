import React, { useCallback } from "react";
import { Header, Form, Input, Grid, Message } from "semantic-ui-react";
import axios from "axios";
import { key } from "../apiKey";
import MoviesSearch from "./Movies/MoviesSearch";

const Search = () => {
  const [search, setSearch] = React.useState("");
  const [err, setErr] = React.useState("");
  const [movies, setMovies] = React.useState([]);

  const asyncFunction = async () => {
    if (search === "") {
      setErr("Please enter a movie");
      return false;
    }
    try {
      let response = await axios.get(
        `http://www.omdbapi.com/?s=${search}&apikey=${key}`
      );

      let data = response.data;
      const errSearch = Object.keys(data).includes("Error");
      if (errSearch) {
        return setErr(data.Error);
      } else {
        return setMovies(data.Search);
      }
    } catch (err) {
      console.log(err);
      return setErr("Error finding the movie");
    }
  };

  const searchHandler = e => {
    e.preventDefault();
    setErr("");
    fetchData();
  };

  const fetchData = useCallback(() => {
    asyncFunction();
  }, [searchHandler]);

  const mapMovies = () => {
    if (movies.length > 0) {
      return movies.map((movie, index) => {
        return (
          <MoviesSearch
            i={index}
            id={movie.imdbID}
            key={index}
            title={movie.Title}
            poster={movie.Poster}
          />
        );
      });
    }
  };

  return (
    <div>
      <Header
        style={{ marginTop: "3rem" }}
        textAlign="center"
        className="register__header"
        as="h1"
        size="huge"
      >
        Search
      </Header>
      <Grid>
        <Grid.Column className="searchForm">
          <Form onSubmit={searchHandler}>
            <Form.Input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Enter movies name"
            />
            <Form.Button fluid color="violet">
              Search
            </Form.Button>
            {err && <Message color="red">{err}</Message>}
          </Form>
        </Grid.Column>
      </Grid>
      <div style={{ margin: "2rem auto", width: "95%" }}>
        <div className="search__results">{mapMovies()}</div>
      </div>
    </div>
  );
};

export default Search;
