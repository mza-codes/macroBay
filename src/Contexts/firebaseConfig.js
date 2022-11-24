import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
const config = {
    apiKey: process.env.REACT_APP_FIREBASE_KEY,
    authDomain: "microbay-mza.firebaseapp.com",
    projectId: "microbay-mza",
    storageBucket: "microbay-mza.appspot.com",
    messagingSenderId: "4720857436",
    appId: "1:4720857436:web:4291db00207a930cebb199",
    measurementId: "G-NR82KGQLFV"
}

export default initializeApp(config)

export const app = initializeApp(config);

export const storage = getStorage(app);

export const auth = getAuth(app);

export const db = getFirestore(app);
