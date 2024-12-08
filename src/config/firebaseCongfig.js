// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9vd0DDXPYfVuLqcnZdDNeC98nnqtZhyQ",
  authDomain: "photo-folio-8b0d7.firebaseapp.com",
  projectId: "photo-folio-8b0d7",
  storageBucket: "photo-folio-8b0d7.firebasestorage.app",
  messagingSenderId: "304562422361",
  appId: "1:304562422361:web:287fdbaaf33ecfd772e748",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
