// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC5gsjXVWd498YD4lmiq1DuVZIapzNJoX4",
    authDomain: "lic1-864b0.firebaseapp.com",
    projectId: "lic1-864b0",
    storageBucket: "lic1-864b0.firebasestorage.app",
    messagingSenderId: "380845715372",
    appId: "1:380845715372:web:6832635086dd80defc5409",
    measurementId: "G-ZJCM2YQLCY"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export { auth, app, firestore, storage };
