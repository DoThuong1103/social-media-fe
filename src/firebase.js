// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANMaiE9BKKOGvxx8vv-sG8LNGisjRwN3o",
  authDomain: "social-media-db-3734f.firebaseapp.com",
  projectId: "social-media-db-3734f",
  storageBucket: "social-media-db-3734f.appspot.com",
  messagingSenderId: "566913934612",
  appId: "1:566913934612:web:5c672194b7281066834e01",
  measurementId: "G-8JDQ6HC51W"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app
