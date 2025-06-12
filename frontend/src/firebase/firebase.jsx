// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBhY4e8qb3c0giTk8mvtJtZ-XDVwrDQiWU",
  authDomain: "roadmap-site.firebaseapp.com",
  projectId: "roadmap-site",
  storageBucket: "roadmap-site.firebasestorage.app",
  messagingSenderId: "939215109",
  appId: "1:939215109:web:3580560689370172124f6c",
  measurementId: "G-053CCLXRZF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);