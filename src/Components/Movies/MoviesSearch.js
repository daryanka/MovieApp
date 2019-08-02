import React from "react";
import { Link } from "react-router-dom";
import { Button, Placeholder } from "semantic-ui-react";

const MoviesSearch = props => {
  let img = <img src={props.poster} />;

  if (props.poster === "N/A") {
    img = (
      <Placeholder style={{ height: "20rem" }}>
        <Placeholder.Image style={{ display: "block", margin: "auto" }} />
      </Placeholder>
    );
  }

  console.log(props);
  return (
    <div className="search__cont">
      <div className="search__cont2">
        <h2 className="search__title">{props.title}</h2>
        {img}
        <Button className="search__btn">
          <Link style={{ color: "black" }} to={`/movie/${props.id}`}>
            More Details
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MoviesSearch;
