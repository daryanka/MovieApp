import React, { useState, useContext } from "react";
import {
  Form,
  Input,
  Header,
  Segment,
  Label,
  Message
} from "semantic-ui-react";
import firebase from "../../firebase/firebase";
import Context from "../../firebase/Context";
import { Link } from "react-router-dom";

const Login = props => {
  const Auth = useContext(Context);

  if (Auth) {
    props.history.push("/home");
  }
  //User Info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [firebaseErr, setFirebaseErr] = useState(null);

  //Error State
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const isValid = (email, password) => {
    setEmailErr("");
    setPasswordErr("");

    let err = [];
    //Email Errors
    if (email === "") {
      setEmailErr("Please enter A email");
      err.push("error");
    } else if (!validateEmail(email)) {
      setEmailErr("Not a valid email");
      err.push("error");
    }

    //Password Errors
    if (password === "") {
      err.push("error");
      setPasswordErr("Please enter a password");
    }

    if (err.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const submitHandler = e => {
    if (isValid(email, password)) {
      setLoading(true);
      firebase
        .auth()
        .signInWithEmailAndPassword(email, password)
        .then(user => {
          setLoading(false);
          props.history.push("/home");
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
          setFirebaseErr(err.message);
        });
    }
  };

  return (
    <div className="register">
      <Header
        style={{ marginTop: "3rem" }}
        textAlign="center"
        className="register__header"
        as="h1"
        size="huge"
      >
        Login
      </Header>
      <Segment style={{ margin: "2rem auto" }} className="register__segment">
        <Form onSubmit={submitHandler} className="register__form">
          <Form.Field
            label="Email"
            placeholder="Email Address"
            control={Input}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          {emailErr && (
            <div className="center">
              <Label
                style={{ margin: "auto", fontSize: "1.2rem" }}
                basic
                color="red"
                pointing
              >
                {emailErr}
              </Label>
            </div>
          )}
          <Form.Field
            label="Password"
            placeholder="Password"
            control={Input}
            value={password}
            type="password"
            onChange={e => setPassword(e.target.value)}
          />
          {passwordErr && (
            <div className="center">
              <Label
                style={{ margin: "auto", fontSize: "1.2rem" }}
                basic
                color="red"
                pointing
              >
                {passwordErr}
              </Label>
            </div>
          )}
          <Message style={{ fontSize: "1.5rem" }}>
            Dont have an account? Register <Link to="/register">Here</Link>
          </Message>
          <Form.Button
            loading={loading}
            disabled={loading}
            style={{ marginTop: "1rem" }}
            type="submit"
            fluid
            color="violet"
          >
            Login
          </Form.Button>
        </Form>
        {firebaseErr && <Message color="red">{firebaseErr}</Message>}
      </Segment>
    </div>
  );
};

export default Login;
