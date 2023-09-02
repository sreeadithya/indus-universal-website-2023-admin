import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAVFuygqYtsP-9ACUBgvz7NdovWyXPDxEo",
  authDomain: "indus-universal-website-2023.firebaseapp.com",
  databaseURL:
    "https://indus-universal-website-2023-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "indus-universal-website-2023",
  storageBucket: "indus-universal-website-2023.appspot.com",
  messagingSenderId: "270406486757",
  appId: "1:270406486757:web:0319867308d983ff92620c",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getDatabase(app);

import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

let userEmail;
let userPassword;
let showLoggedIn = "none";
let showLoggedOut = "none";

const auth = getAuth();
let user = auth.currentUser;

// ! Functions to handle authentication of the user

// async function logInButton(userEmail, userPassword) {
//   signInWithEmailAndPassword(auth, userEmail, userPassword)
//     .then((userCredential) => {
// ? User Signed in
//       user = userCredential.user;
//     })
//     .catch((error) => {
// TODO Add functionality to error messages, codes
//       return error;
//     });
// }

async function logInButton(userEmail, userPassword) {
  try {
    await signInWithEmailAndPassword(auth, userEmail, userPassword).then(
      (userCredential) => {
        user = userCredential.user;
      }
    );
    return null;
  } catch (error) {
    return error;
  }
}

function logOutButton() {
  signOut(auth)
    .then(() => {
      console.log("signed Out successfully");
      console.log(uid);
    })
    .catch((error) => {
      // TODO Add functionality to error messages, codes
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  window.location = "/";
}

export {
  auth,
  storage,
  app,
  db,
  showLoggedIn,
  logInButton,
  logOutButton,
  showLoggedOut,
};
