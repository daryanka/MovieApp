import React, { useContext } from "react";
import { NavLink, Link, withRouter } from "react-router-dom";
import Context from "../firebase/Context";
import firebase from "../firebase/firebase";
import { Popup, Header } from "semantic-ui-react";

const Nav = props => {
  const user = useContext(Context);
  console.log(user);

  const signoutHandler = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log("Logged out");
        props.history.push("/home");
      })
      .catch(err => {
        console.log(err);
      });
  };

  let show = (
    <>
      <NavLink activeClassName="nav__active" className="nav__item" to="/Login">
        Login
      </NavLink>
      <NavLink
        activeClassName="nav__active"
        className="nav__item"
        to="/register"
      >
        Register
      </NavLink>
    </>
  );

  if (user) {
    show = (
      <>
        <div>
          <NavLink
            activeClassName="nav__active"
            className="nav__item"
            to="/favourites"
          >
            My Favourites
          </NavLink>
        </div>
        <div>
          <Popup
            position="top right"
            flowing
            hoverable
            trigger={
              <a style={{ cursor: "pointer" }} className="nav__item">
                Signout
              </a>
            }
          >
            <Header as="h5">
              Confirm by clicking{" "}
              <a style={{ cursor: "pointer" }} onClick={signoutHandler}>
                here
              </a>
            </Header>
          </Popup>
        </div>
      </>
    );
  }

  return (
    <div className="nav">
      <div className="nav__left">
        <div>
          <NavLink
            activeClassName="nav__active"
            className="nav__item"
            to="/home"
          >
            Movie App
          </NavLink>
        </div>
      </div>
      <div className="nav__right">
        <div>
          <NavLink
            activeClassName="nav__active"
            className="nav__item"
            to="/search"
          >
            Search
          </NavLink>
        </div>
        {show}
      </div>
    </div>
  );
};

export default withRouter(Nav);
