import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
const config = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "microbay-mza.firebaseapp.com",
    projectId: "microbay-mza",
    storageBucket: "microbay-mza.appspot.com",
    messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
    appId: process.env.REACT_APP_FIREBASE_APP_ID,
    measurementId: "G-NR82KGQLFV"
}

export default initializeApp(config)

export const app = initializeApp(config);

export const storage = getStorage(app);

export const auth = getAuth(app);

export const db = getFirestore(app);
