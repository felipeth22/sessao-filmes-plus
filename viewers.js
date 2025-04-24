// viewers.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import {
  getFirestore,
  doc,
  onSnapshot,
  updateDoc,
  increment,
  setDoc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase config
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

// Referência do contador de espectadores
const viewerRef = doc(db, "viewers", "live_view_count");

// Inicializa o contador se não existir
setDoc(viewerRef, { count: 0 }, { merge: true });

// Função para atualizar o contador
function updateViewerCount(incrementValue) {
  updateDoc(viewerRef, { count: increment(incrementValue) });
}

// Função para verificar se o usuário já foi contado
function checkUserOnline() {
  if (!localStorage.getItem("userOnline")) {
    localStorage.setItem("userOnline", "true");
    updateViewerCount(1); // Incrementa a contagem
  }
}

// Função para remover o usuário ao sair
function removeUserOnExit() {
  if (localStorage.getItem("userOnline")) {
    localStorage.removeItem("userOnline");
    updateViewerCount(-1); // Decrementa a contagem
  }
}

// Checa se o usuário está online ao carregar a página
window.onload = checkUserOnline;

// Remove o usuário ao sair ou fechar a página
window.addEventListener("beforeunload", removeUserOnExit);

// Mostra o contador em tempo real
const viewerCountElement = document.getElementById("viewer-count");
onSnapshot(viewerRef, (docSnap) => {
  if (docSnap.exists()) {
    viewerCountElement.textContent = `👁️ ${docSnap.data().count} pessoas assistindo agora`;
  } else {
    viewerCountElement.textContent = "👁️ 0 pessoas assistindo agora";
  }
});
