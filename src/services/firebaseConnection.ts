import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyACLyEBrZg_FUA3VJOn5ISz340GkDgfnuI",
    authDomain: "webcarros-f8ecf.firebaseapp.com",
    projectId: "webcarros-f8ecf",
    storageBucket: "webcarros-f8ecf.firebasestorage.app",
    messagingSenderId: "337380024562",
    appId: "1:337380024562:web:6ab0a0228ce3b232d8306b"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const auth = getAuth(app)
const storage = getStorage(app)

export { db, auth, storage }


