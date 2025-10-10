// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD0pWKC08FirZBnak29D-fFV2rOjav85jI",
  authDomain: "carlink-bb7c8.firebaseapp.com",
  projectId: "carlink-bb7c8",
  storageBucket: "carlink-bb7c8.firebasestorage.app",
  messagingSenderId: "324886243929",
  appId: "1:324886243929:web:deb1a1e97c0ea884ef5f48",
  measurementId: "G-6LZFW8RCEQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
