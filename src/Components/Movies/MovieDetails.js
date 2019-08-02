import React, { useContext, useCallback } from "react";
import Context from "../../firebase/Context";
import axios from "axios";
import { key } from "../../apiKey";
import { Divider, List, Button, Placeholder } from "semantic-ui-react";
import { Link } from "react-router-dom";
import firebase from "../../firebase/firebase";
const MovieDetails = props => {
  const [movie, setMovie] = React.useState({});
  const [err, setErr] = React.useState("");
  const Auth = useContext(Context);
  const [id, setID] = React.useState(props.match.params.id);
  const [loading, setLoading] = React.useState(true);
  const [inDB, setInDB] = React.useState(false);

  const ref = firebase.database().ref("favourites");

  React.useEffect(() => {
    getMovie();
  }, []);

  let fav = (
    <p>
      <Link to="/Register">Register</Link> to be able to favourite this movie.
    </p>
  );

  const add = () => {
    firebase
      .database()
      .ref("favourites")
      .child(Auth.uid)
      .push({ imdbID: id });
  };

  const checkHandler = async () => {
    const fb = await firebase
      .database()
      .ref("favourites")
      .child(Auth.uid)
      .on("value", snap => {
        let ar = [];
        let movies = snap.val();
        if (!snap.val()) {
          add();
          return;
        }
        for (let el in movies) {
          if (movies[el].imdbID == id) {
            return setInDB(true);
          } else {
          }
        }
        add();
      });
  };

  const favouriteHandler = () => {
    checkHandler();
  };

  if (Auth) {
    fav = (
      <Button onClick={favouriteHandler} disabled={loading} color="violet">
        Add to favourites
      </Button>
    );
    if (inDB) {
      fav = (
        <Button onClick={favouriteHandler} disabled={true} color="violet">
          Add to favourites
        </Button>
      );
    }
  }

  const getMovie = async () => {
    try {
      let response = await axios.get(
        `https://www.omdbapi.com/?i=${id}&apikey=${key}`
      );

      let data = response.data;
      setLoading(false);
      const errCheck = Object.keys(data).includes("Error");
      if (errCheck) {
        console.log(data);
        setLoading(true);
        return setErr("Could not find the movie");
      } else {
        console.log(data);
        return setMovie(data);
      }
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  if (setErr === "Could not find the movie") {
    setLoading(true);
  }

  return (
    <div className="movie__cont">
      <div className="movie">
        <div className="movie__image">
          {loading ? (
            <Placeholder
              className="movie__img__placeholder"
              style={{ margin: "2rem auto", height: "50vh" }}
            >
              <Placeholder.Image className="movie__img" />
            </Placeholder>
          ) : (
            <img className="movie__img" src={movie.Poster} />
          )}
        </div>
        <div className="movie__basicInfo">
          {/* Title,rating genre, runtime, rated: PG, release date */}
          <div className="movie__basicInfo__centered">
            {loading ? (
              <Placeholder>
                <Placeholder.Header>
                  <Placeholder.Line />
                </Placeholder.Header>
              </Placeholder>
            ) : (
              <h2 style={{ fontSize: "4rem" }}>{movie.Title}</h2>
            )}
            <Divider />
            {loading ? (
              <>
                <Placeholder>
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                  <Placeholder.Line />
                </Placeholder>
                <div style={{ height: "2rem" }} />
              </>
            ) : (
              <List
                size="massive"
                style={{ margin: "2rem auto", fontSize: "2rem" }}
              >
                <List.Item>Genre: {movie.Genre}</List.Item>
                <List.Item>Runtime: {movie.Runtime}</List.Item>
                <List.Item>Released Data: {movie.Released}</List.Item>
                <List.Item>Rating: {movie.imdbRating}</List.Item>
                <List.Item>Rated: {movie.Rated}</List.Item>
              </List>
            )}
            {fav}
          </div>
        </div>
      </div>
      <Divider style={{ width: "90%", margin: "auto" }} />
      <div className="movie__info">
        {loading ? (
          <Placeholder className="movie__placeholder__text">
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder>
        ) : (
          <List
            style={{ fontSize: "2rem" }}
            className="movie__margin"
            size="large"
          >
            <List.Item>Director: {movie.Director}</List.Item>
            <List.Item>Write: {movie.Writer}</List.Item>
            <List.Item>Cast: {movie.Actors}</List.Item>
            <List.Item>Awards: {movie.Awards}</List.Item>
          </List>
        )}
        <Divider style={{ width: "90%", margin: "auto" }} />
        <h2 style={{ fontSize: "2.5rem" }}>Plot</h2>
        {loading ? (
          <Placeholder className="movie__placeholder__text">
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
            <Placeholder.Line />
          </Placeholder>
        ) : (
          <p style={{ margin: "2rem auto", fontSize: "2rem" }}>{movie.Plot}</p>
        )}
      </div>
      <div />
    </div>
  );
};

export default MovieDetails;
