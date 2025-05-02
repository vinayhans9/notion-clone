import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "notion-clone-17f85.firebaseapp.com",
  projectId: "notion-clone-17f85",
  storageBucket: "notion-clone-17f85.firebasestorage.app",
  messagingSenderId: "818553669370",
  appId: "1:818553669370:web:46b1cc994075d545006b43",
  measurementId: "G-GB52LH7XWP"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

export { db };