import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  push,
  set,
  get,
  remove,
  update,
  child,
  onValue,
} from "firebase/database";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APP_API_KEY,
  authDomain: import.meta.env.VITE_APP_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_APP_DATA_BASE_URL,
  projectId: import.meta.env.VITE_APP_PROJECT_ID,
  storageBucket: import.meta.env.VITE_APP_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_APP_MESSAGINSENDERID,
  appId: import.meta.env.VITE_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);

const Auth = getAuth(app);
const RealTimeDataBase = getDatabase(app);

export {
  signInWithPopup,
  Auth,
  GoogleAuthProvider,
  onAuthStateChanged,
  RealTimeDataBase,
  ref,
  push,
  set,
  get,
  remove,
  update,
  child,
  onValue,
};
