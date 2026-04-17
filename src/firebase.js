import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBJOsABwU5vbFolx91-bMoD4EIShv6mu5U",
  authDomain: "undanganku-40d60.firebaseapp.com",
  databaseURL: "https://undanganku-40d60-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "undanganku-40d60",
  storageBucket: "undanganku-40d60.firebasestorage.app",
  messagingSenderId: "727486271718",
  appId: "1:727486271718:web:b8e38ac267f8959275ab27",
  measurementId: "G-M3V9YTPX3V"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
