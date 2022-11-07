// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyBNZ2D7bTLsZg2_cyrLxLbRd1ZLLKkTkrQ',
  authDomain: 'bookingv2-82128.firebaseapp.com',
  projectId: 'bookingv2-82128',
  storageBucket: 'bookingv2-82128.appspot.com',
  messagingSenderId: '777789783029',
  appId: '1:777789783029:web:f1b7adcf7f5dd86a287ebc',
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();
