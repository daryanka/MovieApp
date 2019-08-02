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

const Register = props => {
  const Auth = useContext(Context);

  if (Auth) {
    props.history.push("/home");
  }
  //User Info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [firebaseErr, setFirebaseErr] = useState(null);

  //Error State
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [confirmPasswordErr, setConfirmPasswordErr] = useState("");

  function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const isValid = (email, password, confirmPassword) => {
    setEmailErr("");
    setPasswordErr("");
    setConfirmPasswordErr("");
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
    } else if (password.length < 7) {
      err.push("error");
      setPasswordErr("Password must be longer than 6 characters");
    }

    if (confirmPassword === "") {
      err.push("error");
      setConfirmPasswordErr("Please confirm your password");
    } else if (confirmPassword !== password) {
      err.push("error");
      setConfirmPasswordErr("Passwords do not match");
    }

    if (err.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  const submitHandler = e => {
    if (isValid(email, password, confirmPassword)) {
      setLoading(true);
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(user => {
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setLoading(false);
          props.history.push("/home");
        })
        .catch(err => {
          setFirebaseErr(err.message);
          console.log(err);
          setLoading(false);
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
        Register
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
                style={{ margin: "auto", fontSize: "1.5rem" }}
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
                style={{ margin: "auto", fontSize: "1.5rem" }}
                basic
                color="red"
                pointing
              >
                {passwordErr}
              </Label>
            </div>
          )}
          <Form.Field
            label="Confirm Password"
            placeholder="Password"
            control={Input}
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
          {confirmPasswordErr && (
            <div className="center">
              <Label
                style={{ margin: "auto", fontSize: "1.5rem" }}
                basic
                color="red"
                pointing
              >
                {confirmPasswordErr}
              </Label>
            </div>
          )}
          <Message style={{ fontSize: "1.5rem" }}>
            Already have an account? Login <Link to="/register">Here</Link>
          </Message>
          <Form.Button
            loading={loading}
            disabled={loading}
            style={{ marginTop: "1rem" }}
            type="submit"
            fluid
            color="violet"
          >
            Sign Up
          </Form.Button>
        </Form>
        {firebaseErr && (
          <Message style={{ fontSize: "1.5rem" }} color="red">
            {firebaseErr}
          </Message>
        )}
      </Segment>
    </div>
  );
};

export default Register;
