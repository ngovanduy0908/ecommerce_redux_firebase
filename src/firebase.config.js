// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDOPrCI3uW_jggbO4LGI4r331gsw9IgjrY',
    authDomain: 'ecommerce-1fc85.firebaseapp.com',
    projectId: 'ecommerce-1fc85',
    storageBucket: 'ecommerce-1fc85.appspot.com',
    messagingSenderId: '846095825939',
    appId: '1:846095825939:web:1f4c08138bfff261aa93e6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
