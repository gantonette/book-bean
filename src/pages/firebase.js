// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDB5ZxCUwKTpmgNQspzbvtDmlsZhCgvFM8",
  authDomain: "book-bean-project.firebaseapp.com",
  projectId: "book-bean-project",
  storageBucket: "book-bean-project.appspot.com",
  messagingSenderId: "261947907306",
  appId: "1:261947907306:web:7fe6d990466f303f444b93",
  measurementId: "G-RNE7EP0GJL",
  storageBucket: "gs://book-bean-project.appspot.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Cloud Storage and get a reference to the service
const storage = getStorage(app);

// Create a storage reference from our storage service

const auth = getAuth(app);


const db = getFirestore(app);

export {
  db,
  storage
}
