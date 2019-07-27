import React from "react";
import Context from "../firebase/Context";
import { Loader, List, Divider, Button } from "semantic-ui-react";
import firebase from "../firebase/firebase";
import axios from "axios";
import { key } from "../apiKey";
import { async } from "q";
import MovieDetails from "./Movies/MovieDetails";
import { Link } from "react-router-dom";

const Favourites = props => {
  const Auth = React.useContext(Context);
  const [movies, setMovies] = React.useState([]);
  const [moviesID, setMoviesID] = React.useState([]);

  const [noMovies, setNoMovies] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [disable, setDisable] = React.useState(false);

  if (!Auth) {
    props.history.push("/home");
  }

  React.useEffect(() => {
    setLoading(true);
    setMovies([]);
    if (Auth) {
      firebase
        .database()
        .ref("favourites")
        .child(Auth.uid)
        .on("value", snap => {
          setLoading(false);
          if (!snap.val()) {
            setNoMovies(true);
          }
          let value = snap.val();
          let ar = []; //Contains all imdbID's
          let idAr = [];
          let moviesToState = [];
          for (let el in value) {
            ar.push(value[el].imdbID);
            idAr.push({ [value[el].imdbID]: el });
          }
          setMoviesID(idAr);
          const moviesArr = ar.forEach((id, index) => {
            const asyncRequest = async id => {
              const res = await getMovie(id);
            };
            asyncRequest(id);
          });
        });
    }
  }, []);

  //Api call
  const getMovie = async id => {
    try {
      const response = await axios.get(
        `http://www.omdbapi.com/?i=${id}&apikey=${key}`
      );
      let data = response.data;
      setMovies(prev => {
        return [...prev, data];
      });
      return data;
    } catch (err) {
      console.log(err);
      return err;
    }
  };

  const movieDetailsHandler = id => {
    props.history.push(`/movie/${id}`);
  };

  const removeHandler = (id, index) => {
    setDisable(true);
    let idToDelete = null;
    moviesID.forEach((value, index) => {
      const key = Object.keys(value);
      if (key == id) {
        idToDelete = value[key];
      }
    });

    const remove = () => {
      firebase
        .database()
        .ref("favourites")
        .child(Auth.uid)
        .child(idToDelete)
        .remove()
        .then(() => {
          setDisable(false);
          const filtered = movies.filter((value, index) => {
            if (id === value.imdbID) {
              console.log("delete this one", value);
              return false;
            } else {
              return true;
            }
          });
          console.log(filtered);
          return setMovies(filtered);
        });
    };

    firebase
      .database()
      .ref("favourites")
      .child(Auth.uid)
      .child(idToDelete)
      .on("value", snap => {
        if (snap.val() !== null) {
          remove();
        }
      });
  };

  let box = null;

  console.log(movies);

  if (noMovies) {
    box = (
      <p style={{ textAlign: "center" }}>
        No movies favourited, search for your favourite movies{" "}
        <Link to="/search">here.</Link>
      </p>
    );
  }

  if (loading) {
    box = <Loader active size="massive" inline="centered" />;
  }

  if (movies.length > 0) {
    box = movies.map((movie, index) => {
      return (
        <div key={index} className="fav__box">
          <h2 className="fav__box__header">{movie.Title}</h2>
          <div style={{ width: "100%" }}>
            <img
              alt="home alone"
              className="fav__box__img"
              src={movie.Poster}
            />
          </div>
          <div className="fav__box__info">
            <List size="huge">
              <List.Item>Genre: {movie.Genre}</List.Item>
              <List.Item>Runtime: {movie.Runtime}</List.Item>
              <List.Item>Released Data: {movie.Released}</List.Item>
              <List.Item>Rating: {movie.imdbRating}</List.Item>
              <List.Item>Rated: {movie.Rated}</List.Item>
            </List>
            <Button
              color="black"
              onClick={() => movieDetailsHandler(movie.imdbID)}
            >
              More Details
            </Button>
            <Button
              style={{ marginLeft: "1rem" }}
              inverted
              color="red"
              disabled={disable}
              onClick={() => removeHandler(movie.imdbID, index)}
            >
              Remove From Favourites
            </Button>
          </div>
          <Divider />
        </div>
      );
    });
  }

  return (
    <div>
      <h1 className="fav__header">My Favourites</h1>
      <div className="fav__cont">{box}</div>
    </div>
  );
};

export default Favourites;
