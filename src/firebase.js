// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZ5K_u9bVYlSZUXbq0WUBKwojw-vlrBVo",
  authDomain: "social-media-1-a4d1e.firebaseapp.com",
  projectId: "social-media-1-a4d1e",
  storageBucket: "social-media-1-a4d1e.appspot.com",
  messagingSenderId: "585114795929",
  appId: "1:585114795929:web:73e607188a195946b7dd08",
  measurementId: "G-3BP6TH78MQ"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export default app
