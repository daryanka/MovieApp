import React from "react";
import "./App.css";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./Components/Home";
import Favourites from "./Components/Favourites";
import Search from "./Components/Search";
import Register from "./Components/Auth/Register";
import Login from "./Components/Auth/Login";
import Nav from "./Components/Nav";
import useAuth from "./Components/Auth/Auth";
import Context from "./firebase/Context";
import MovieDetails from "./Components/Movies/MovieDetails";

function App() {
  const Auth = useAuth();
  return (
    <Context.Provider value={Auth}>
      <Nav />
      <Switch>
        <Route path="/" exact render={() => <Redirect to="/home" />} />
        <Route path="/home" component={Home} />
        <Route path="/Login" component={Login} />
        <Route path="/Register" component={Register} />
        <Route path="/Search" component={Search} />
        <Route path="/Favourites" component={Favourites} />
        <Route path="/movie/:id" component={MovieDetails} />
      </Switch>
    </Context.Provider>
  );
}

export default App;
