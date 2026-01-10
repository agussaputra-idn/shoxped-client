import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAQYiRBjOIRzt5B9m7MYXNRsclvQn66h7U",
  authDomain: "shoxped-security.firebaseapp.com",
  projectId: "shoxped-security",
  storageBucket: "shoxped-security.firebasestorage.app",
  messagingSenderId: "181166563080",
  appId: "1:181166563080:web:a036bffd3e3495a57596bd",
  measurementId: "G-CT7QZESZ6B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);       // Fitur Login
const db = getFirestore(app);    // Fitur Database

export { auth, db, analytics };