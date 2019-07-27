import firebaseConf from "./config";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// Initialize Firebase

firebase.initializeApp(firebaseConf);

export default firebase;
