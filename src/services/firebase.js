// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
    apiKey: "AIzaSyA5YqhrrHm2PH2ZDDSRl84isyhjycgHWYA",
    authDomain: "bookblog-be063.firebaseapp.com",
    projectId: "bookblog-be063",
    storageBucket: "bookblog-be063.appspot.com",
    messagingSenderId: "115419977570",
    appId: "1:115419977570:web:cb4764fd87d95c18e9be3b",
    measurementId: "G-607VVQL4WD"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);


export { db, auth };
