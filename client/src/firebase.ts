import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; // 👈 1. Import ini wajib ada

const firebaseConfig = {
  apiKey: "AIzaSyAQYiRBjOIRzt5B9m7MYXNRsclvQn66h7U",
  authDomain: "shoxped-security.firebaseapp.com",
  projectId: "shoxped-security",
  storageBucket: "shoxped-security.firebasestorage.app",
  messagingSenderId: "181166563080",
  appId: "1:181166563080:web:a036bffd3e3495a57596bd",
  measurementId: "G-CT7QZESZ6B",
  // 👇 2. Tambahkan URL Realtime Database ini (PENTING)
  databaseURL: "https://shoxped-security-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);        // Ini Database untuk Produk (Firestore)
const realtimeDb = getDatabase(app); // 👈 3. Ini Database untuk Visitor (Realtime)

// 4. Jangan lupa export realtimeDb-nya
export { auth, db, realtimeDb, analytics };