// services/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyB2vQF6VvbKH035VXbXxAz5KgccDfbU31U",
  authDomain: "traderisk-463ed.firebaseapp.com",
  projectId: "traderisk-463ed",
  storageBucket: "traderisk-463ed.appspot.com",
  messagingSenderId: "197657815368",
  appId: "1:197657815368:web:5bc3ed391b4a07286feb7d"
};


const app = initializeApp(firebaseConfig);

// Use the modular approach to get the messaging instance
const messaging = getMessaging(app);

export { messaging };
