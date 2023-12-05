// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyByyZWEmgDiqQWlbEo-lPexbwSP-9SYWJA",
  authDomain: "social-media-c8bfc.firebaseapp.com",
  projectId: "social-media-c8bfc",
  storageBucket: "social-media-c8bfc.appspot.com",
  messagingSenderId: "165750308332",
  appId: "1:165750308332:web:36d660f87f3b935f4714c9",
  measurementId: "G-JQHGGZJE3P"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app
