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

export { storage, app, db };
