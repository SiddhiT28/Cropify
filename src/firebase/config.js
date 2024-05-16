import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAz2cf9yj45qEP-wroy1Ee_XP1fXM0n5as",
  authDomain: "ioe-mini-project-43c17.firebaseapp.com",
  databaseURL: "https://ioe-mini-project-43c17-default-rtdb.firebaseio.com",
  projectId: "ioe-mini-project-43c17",
  storageBucket: "ioe-mini-project-43c17.appspot.com",
  messagingSenderId: "472902979220",
  appId: "1:472902979220:web:0b157c7189d98a565dae81",
  measurementId: "G-FWW7V46WTE",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
