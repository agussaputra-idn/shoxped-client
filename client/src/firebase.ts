import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database"; 
import { getAnalytics } from "firebase/analytics"; 

// 🔥 CONFIG PRODUKSI (SHOXPED ASLI) 🔥
const firebaseConfig = {
  apiKey: "AIzaSyAi1NKoE5CkHgyo37j3MR1ea1-5kOID8h4",
  authDomain: "shoxped-backup.firebaseapp.com",
  databaseURL: "https://shoxped-backup-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "shoxped-backup",
  storageBucket: "shoxped-backup.firebasestorage.app",
  messagingSenderId: "487780280679",
  appId: "1:487780280679:web:3751d15a274c15791ca7c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);        
const realtimeDb = getDatabase(app); 
const analytics = getAnalytics(app); // Analytics diaktifkan kembali karena ini production

// Export services
export { auth, db, realtimeDb, analytics };