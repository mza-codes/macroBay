import firebase from "firebase";
import 'firebase/firebase-auth'
// import { FIREBASE_KEY } from "../Constants";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: 'FIREBASE_KEY',
    authDomain: "microbay-mza.firebaseapp.com",
    projectId: "microbay-mza",
    storageBucket: "microbay-mza.appspot.com",
    messagingSenderId: "4720857436",
    appId: "1:4720857436:web:4291db00207a930cebb199",
    measurementId: "G-NR82KGQLFV"
};

export default firebase = firebase.initializeApp(firebaseConfig)