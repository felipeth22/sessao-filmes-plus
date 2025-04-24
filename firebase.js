// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFGl-c05ASHqV9D_P9D2joqbKlN6VGil0",
  authDomain: "sessao-filmes-plus-chat.firebaseapp.com",
  projectId: "sessao-filmes-plus-chat",
  storageBucket: "sessao-filmes-plus-chat.appspot.com",
  messagingSenderId: "307774865030",
  appId: "1:307774865030:web:c65924ce244aab8d7ddb07",
  measurementId: "G-46Y64F6RH9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
