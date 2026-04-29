import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQEsZnwXOyxE7RciUS75htS2aK3muwdMM",
  authDomain: "fireloc-e68b0.firebaseapp.com",
  projectId: "fireloc-e68b0",
  storageBucket: "fireloc-e68b0.firebasestorage.app",
  messagingSenderId: "498459726219",
  appId: "1:498459726219:android:f5c44cf65eb1337db01f8e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);