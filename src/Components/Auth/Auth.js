import React from "react";
import firebase from "../../firebase/firebase";

const Auth = () => {
  const [authUser, setAuthUser] = React.useState(null);
  React.useEffect(() => {
    const sub = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => sub();
  }, []);

  return authUser;
};

export default Auth;
