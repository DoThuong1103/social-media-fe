// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9kYr4xIhhX8bmGV93qKY6P1d6m35Fk5Q",
  authDomain: "social-media-2-e01b4.firebaseapp.com",
  projectId: "social-media-2-e01b4",
  storageBucket: "social-media-2-e01b4.appspot.com",
  messagingSenderId: "175139590860",
  appId: "1:175139590860:web:579cd8895706ac1cce6869",
  measurementId: "G-4NGF00589Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app
