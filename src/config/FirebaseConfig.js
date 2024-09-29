
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCvOp1KBS7U6tPYSI_3BnDTcrl1hy448dI",
  authDomain: "react-blogging-app-7e6d1.firebaseapp.com",
  projectId: "react-blogging-app-7e6d1",
  storageBucket: "react-blogging-app-7e6d1.appspot.com",
  messagingSenderId: "129993561281",
  appId: "1:129993561281:web:c38fde43c9b383513a3040",
  measurementId: "G-HFYV8GJ4ES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);