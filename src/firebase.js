// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB3cLJ9F7XoaNncAXtoMHGyF36wY5nkgB8",
  authDomain: "educachat-a3a76.firebaseapp.com",
  projectId: "educachat-a3a76",
  storageBucket: "educachat-a3a76.appspot.com", // Corrigido: debe ser .appspot.com
  messagingSenderId: "542984944434",
  appId: "1:542984944434:web:9265bb154fed857a30b52b",
  measurementId: "G-7RJ6F73YK1"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
