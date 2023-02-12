// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, uploadString, uploadBytes } from "firebase/storage";
import { getAuth } from "firebase/auth";
import 'firebase/storage';



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


const storage = getStorage();
// const storageRef = ref(storage, 'some-child-file');

// const file = new File(['hello'], 'hello.txt')

// // 'file' comes from the Blob or File API
// uploadBytes(storageRef, file).then((snapshot) => {
//   console.log('Uploaded a blob or file!');
// });

// Raw string is the default if no format is provided
// const message = 'This is my message.';
// uploadString(storageRef, message).then((snapshot) => {
//   console.log('Uploaded a raw string!');
// });

const auth = getAuth(app);


const db = getFirestore(app);

export {
  db,
  storage
}
