// chat.js
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

import { db } from './firebase.js';

// Função para enviar mensagens
async function sendMessage() {
  const username = document.getElementById('username').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!username || !message) return alert("Digite seu nome e uma mensagem.");

  await addDoc(collection(db, "chat"), {
    name: username,
    text: message,
    timestamp: serverTimestamp()
  });

  document.getElementById('message').value = "";
  removeOldMessages();
}

// Captura Enter
document.getElementById('message').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Botão enviar
document.getElementById('sendMessageButton').addEventListener('click', sendMessage);

// Salva nome no localStorage
const usernameInput = document.getElementById('username');
if (localStorage.getItem('username')) {
  usernameInput.value = localStorage.getItem('username');
}
usernameInput.addEventListener('blur', () => {
  const name = usernameInput.value.trim();
  if (name) localStorage.setItem('username', name);
});

// Mostrar mensagens em tempo real
const chatQuery = query(collection(db, "chat"), orderBy("timestamp"));
onSnapshot(chatQuery, (snapshot) => {
  const chatBox = document.getElementById('chat-messages');
  chatBox.innerHTML = "";

  snapshot.docs.slice(-50).forEach((doc) => {
    const data = doc.data();
    const div = document.createElement('div');
    div.classList.add('chat-message');
    div.innerHTML = `<strong style="color:#FF6347">${data.name}:</strong> ${data.text}`;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
});

// Remove mensagens antigas
function removeOldMessages() {
  const chatQuery = query(collection(db, "chat"), orderBy("timestamp"));
  onSnapshot(chatQuery, (snapshot) => {
    if (snapshot.docs.length > 50) {
      const oldest = snapshot.docs[0];
      deleteDoc(doc(db, "chat", oldest.id));
    }
  });
}
