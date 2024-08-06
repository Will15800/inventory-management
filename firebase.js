// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCCphN-aIho_o4zOxDd2iRR6AwlIZzqzS0",
  authDomain: "inventorymanageapp.firebaseapp.com",
  projectId: "inventorymanageapp",
  storageBucket: "inventorymanageapp.appspot.com",
  messagingSenderId: "306350269662",
  appId: "1:306350269662:web:e57727b1b361d0bf3e0e4f",
  measurementId: "G-5JKTKKR07G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export { firestore };