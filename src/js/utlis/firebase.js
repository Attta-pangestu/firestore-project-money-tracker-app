import {initializeApp} from 'firebase/app' ; 
import {getAuth} from 'firebase/auth' ;
import {getFirestore} from 'firebase/firestore' ;

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBopesf1yC5BUmYOjF0FnWe3tfWwLzGdy8",
    authDomain: "dicoding-1-8dcb8.firebaseapp.com",
    databaseURL: "https://dicoding-1-8dcb8-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "dicoding-1-8dcb8",
    storageBucket: "dicoding-1-8dcb8.appspot.com",
    messagingSenderId: "673688133298",
    appId: "1:673688133298:web:dac078a2eedeedc88fb3ab",
    measurementId: "G-M6SML57Y0C"
};

// Init Firebase App 
const app = initializeApp(firebaseConfig) ; 

//Init Auth Service 
const firebaseAuth = getAuth(app) ; 

// Init Firestore
const db = getFirestore(app) ; 

export {app, firebaseAuth, db} ;