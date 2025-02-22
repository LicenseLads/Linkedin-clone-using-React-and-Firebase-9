// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBhEW8nzDQAq3JJimLA2MW1OQKkrmf8JnY",
  authDomain: "licenta-348d5.firebaseapp.com",
  projectId: "licenta-348d5",
  storageBucket: "licenta-348d5.firebasestorage.app",
  messagingSenderId: "796281074385",
  appId: "1:796281074385:web:15a2074da330a51c834bf0",
  measurementId: "G-PHG2B6WKQD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
export { auth, app, firestore, storage };
