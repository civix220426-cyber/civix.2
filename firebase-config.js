import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyCGT98EYf4SU6FqyfUGClWi3FoZia96MGw",
    authDomain: "civix2.firebaseapp.com",
    projectId: "civix2",
    storageBucket: "civix2.firebasestorage.app",
    messagingSenderId: "743068024701",
    appId: "1:743068024701:web:7f7ebfe2abe9c6863a9614",
    measurementId: "G-1F0RHPDZ7K"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);