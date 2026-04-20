// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCFWOBZbZB9MOZqbeH4yebf6I5UWsJrYto",
  authDomain: "ai-trip-planner-14c6a.firebaseapp.com",
  projectId: "ai-trip-planner-14c6a",
  storageBucket: "ai-trip-planner-14c6a.firebasestorage.app",
  messagingSenderId: "556355471306",
  appId: "1:556355471306:web:07d74c7f7f7aa9878f3133",
  measurementId: "G-5XS17166RB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);