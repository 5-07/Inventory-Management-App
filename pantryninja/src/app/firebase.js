// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
 
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyChmU3bp1q_OpsOrRL5NPRnB4pmRtvpIPs",
  authDomain: "pantry-tracker-ee545.firebaseapp.com",
  projectId: "pantry-tracker-ee545",
  storageBucket: "pantry-tracker-ee545.appspot.com",
  messagingSenderId: "512393031051",
  appId: "1:512393031051:web:a36c5f5337e914296cd38e"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { db, auth };

