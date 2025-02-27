// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB8NANmrg_TkVbai9Ty21Ur-XlaDQev9Dw",
  authDomain: "sanfranplay.firebaseapp.com",
  projectId: "sanfranplay",
  storageBucket: "sanfranplay.firebasestorage.app",
  messagingSenderId: "628952183411",
  appId: "1:628952183411:web:760ffdd20be671c51b3006",
  measurementId: "G-JREQ0L0YSM"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
export const db = getFirestore(app);
