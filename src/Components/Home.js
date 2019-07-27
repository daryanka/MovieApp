import React from "react";
import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <div className="home__cont">
        <h1 className="home__header">Movie App</h1>
        <h3 className="home__subheader">
          Search for your favourite <br /> movies, see their ratings, cast,
          awards and more.
        </h3>
        <h4 className="home__p">
          Click below to search for your favourite movie.
        </h4>
        <Button className="home__btn">
          <Link style={{ color: "black" }} to="/search">
            Search
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Home;
