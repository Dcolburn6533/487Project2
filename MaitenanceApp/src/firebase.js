
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDJkIoVAfLsqiRpmfKPK1MLHmYnA9AerZU",
    authDomain: "maintanceform.firebaseapp.com",
    projectId: "maintanceform",
    storageBucket: "maintanceform.appspot.com",
    messagingSenderId: "422568838008",
    appId: "1:422568838008:web:13bfaa5b5d391c320b3e8d"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
