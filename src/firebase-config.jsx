// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import { getAuth, GoogleAuthProvider, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD7uE34AnqcWuAZXx2zXHIwvZLVRWa_r9k",
  authDomain: "blog-f7ec0.firebaseapp.com",
  projectId: "blog-f7ec0",
  storageBucket: "blog-f7ec0.firebasestorage.app",
  messagingSenderId: "355299011915",
  appId: "1:355299011915:web:f268b5db751e9d0b5d8cce",
  measurementId: "G-3KSY20Z2HZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
let analytics;
try {
  analytics = getAnalytics(app);
} catch (e) {
  // Ignore analytics init errors in unsupported environments (e.g., no gtag, non-HTTPS)
  console.warn("Analytics not initialized:", e?.message);
}
const auth=getAuth(app);
// Ensure auth state persists across reloads
setPersistence(auth, browserLocalPersistence).catch((e) => {
  console.warn("Failed to set auth persistence:", e?.message);
});
const provider=new GoogleAuthProvider();
const db=getFirestore(app);

export { auth, provider, db };