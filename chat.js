import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";

// Definindo a configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAFGl-c05ASHqV9D_P9D2joqbKlN6VGil0",
  authDomain: "sessao-filmes-plus-chat.firebaseapp.com",
  projectId: "sessao-filmes-plus-chat",
  storageBucket: "sessao-filmes-plus-chat.appspot.com",
  messagingSenderId: "307774865030",
  appId: "1:307774865030:web:c65924ce244aab8d7ddb07",
  measurementId: "G-46Y64F6RH9"
};

// Inicializando o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Lembrando o nome do usuário
const usernameInput = document.getElementById('username');

// Verifica se o nome já foi armazenado no localStorage
if (localStorage.getItem('username')) {
  usernameInput.value = localStorage.getItem('username');
}

// Armazena o nome no localStorage quando o usuário digitar
usernameInput.addEventListener('blur', () => {
  const username = usernameInput.value.trim();
  if (username) {
    localStorage.setItem('username', username);
  }
});

// Função para enviar mensagem
function sendMessage() {
  const username = document.getElementById('username').value.trim();
  const message = document.getElementById('message').value.trim();

  if (username && message) {
    // Envia a mensagem para o Firestore
    addDoc(collection(db, "chat"), {
      name: username,
      text: message,
      timestamp: serverTimestamp()
    }).then(() => {
      // Limpa o campo de mensagem após o envio
      document.getElementById('message').value = "";
      // Remove mensagens antigas se necessário
      removeOldMessages();
    }).catch((error) => {
      console.error('Erro ao enviar mensagem: ', error);
    });
  } else {
    alert("Por favor, digite uma mensagem.");
  }
}

// Adiciona um ouvinte de evento ao botão "Enviar"
document.getElementById('sendMessageButton').addEventListener('click', sendMessage);

// Função para exibir as mensagens em tempo real
const q = query(collection(db, "chat"), orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
  const messagesContainer = document.getElementById("chat-messages");
  messagesContainer.innerHTML = "";
  
  // Limite de 100 mensagens
  const messages = snapshot.docs.slice(-10); // Pega as últimas 10 mensagens
  
  // Exibe as mensagens
  messages.forEach((doc) => {
    const msg = doc.data();
    const messageElement = document.createElement("div");

    // Criação do nome com cor personalizada
    const nameElement = document.createElement("span");
    nameElement.style.color = "#FF6347";  // Cor do nome (você pode trocar essa cor)
    nameElement.innerHTML = `<strong>${msg.name}:</strong>`;

    // Texto da mensagem
    const messageText = document.createElement("span");
    messageText.innerHTML = ` ${msg.text}`;

    // Adiciona as partes à mensagem
    messageElement.appendChild(nameElement);
    messageElement.appendChild(messageText);

    // Adiciona a classe para diferenciar a mensagem do usuário
    messageElement.classList.add("chat-message", msg.name === usernameInput.value ? 'user' : 'system');
    messagesContainer.appendChild(messageElement);
  });

  // Rola até o final para exibir a nova mensagem
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
});

// Função para remover mensagens antigas quando o número de mensagens exceder 100
function removeOldMessages() {
  const chatRef = collection(db, "chat");
  const q = query(chatRef, orderBy("timestamp"));
  
  onSnapshot(q, (snapshot) => {
    // Se o número de mensagens for maior que 10, exclui a mensagem mais antiga
    if (snapshot.docs.length > 10) {
      const firstDoc = snapshot.docs[0]; // A mensagem mais antiga
      deleteDoc(doc(db, "chat", firstDoc.id)); // Exclui a mensagem mais antiga
    }
  });
}

