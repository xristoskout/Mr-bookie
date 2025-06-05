(() => {
  const style = document.createElement("style");
  style.textContent = `
    .chatbox-wrapper {
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
    }
    .toggle-chatbox {
      background: #ffdf43;
      border: none;
      padding: 8px 12px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: bold;
    }
    .chatbox {
      position: fixed;
      bottom: 90px;
      right: 20px;
      flex-direction: column;
      border-radius: 24px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      overflow: hidden;
      height: 550px;
      width: 400px;
      max-width: calc(100vw - 40px);
      background: #fff8f0 url('https://github.com/xristoskout/Mr-bookie/blob/main/Ms%20Booky%20366x567.png?raw=true') no-repeat center center / cover;
      display: none;
      transition: all 0.3s ease;
    }
    .chatbox.show {
      display: flex;
    }
    .chat-header {
      background: #ffdf43;
      padding: 10px;
      text-align: left;
      font-weight: bold;
      font-size: 1.2em;
      position: relative;
    }
    .dark-toggle, .close-chatbox, .clear-chat {
      position: absolute;
      top: 10px;
      cursor: pointer;
      font-weight: bold;
    }
    .dark-toggle { right: 75px; }
    .clear-chat { right: 45px; }
    .close-chatbox { right: 10px; }
    .chat-messages {
      flex: 1;
      padding: 10px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .message {
      max-width: 90%;
      padding: 10px 14px;
      border-radius: 15px;
      word-wrap: break-word;
      display: flex;
      align-items: flex-start;
      gap: 10px;
    }
    .bot {
      background: #ffdf43;
      align-self: flex-start;
    }
    .user {
      background: #f3a45b;
      align-self: flex-end;
    }
    .bot img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }
    .input-area {
      display: flex;
      padding: 10px;
      border-top: 1px solid #ccc;
      align-items: flex-end;
      gap: 8px;
    }
    .input-area input {
      flex: 1;
      padding: 10px;
      border-radius: 10px;
      border: 1px solid #ccc;
      font-size: 1em;
      height: 2.5em;
    }
    .input-area button {
      background: #f3a45b;
      border: none;
      border-radius: 50%;
      width: 4.5em;
      height: 4.5em;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  const html = `
    <div class="chatbox-wrapper">
      <button class="toggle-chatbox" onclick="toggleChat()">💬 Mr Booky</button>
      <div class="chatbox" id="chatbox">
        <div class="chat-header">
          Mr Booky
          <span class="dark-toggle" onclick="toggleDark()">🌓</span>
          <span class="clear-chat" onclick="clearChat()">🗑</span>
          <span class="close-chatbox" onclick="toggleChat()">✖</span>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="input-area">
          <input type="text" id="user-input" placeholder="Πληκτρολογήστε..." onkeydown="if(event.key === 'Enter') sendMessage()" />
          <button onclick="sendMessage()" title="Αποστολή">📤</button>
        </div>
      </div>
    </div>
    <audio id="botSound" src="https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/wet-431.mp3" preload="auto"></audio>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  const chatbox = document.getElementById("chatbox");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const botSound = document.getElementById("botSound");
  let chatOpened = false;
  let session_id = localStorage.getItem("chat_session_id") || ("sess-" + Date.now());
  localStorage.setItem("chat_session_id", session_id);

  window.toggleChat = () => {
    if (!chatbox.classList.contains("show")) {
      chatbox.classList.add("show");
      if (!chatOpened) {
        appendMessage("Καλώς ήρθατε! Είμαι ο Mr Booky. Πώς μπορώ να σας βοηθήσω;", "bot");
        chatOpened = true;
      }
    } else {
      chatbox.classList.remove("show");
    }
  };

  window.toggleDark = () => {
    document.body.classList.toggle("dark");
  };

  window.clearChat = () => {
    chatMessages.innerHTML = '';
    localStorage.removeItem("chat_session_id");
    session_id = "sess-" + Date.now();
    localStorage.setItem("chat_session_id", session_id);
    appendMessage("Η συνομιλία μηδενίστηκε. Ξεκινάμε από την αρχή.", "bot");
  };

  function appendMessage(content, sender) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    if (sender === "bot") {
      const linkedText = content.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
      message.innerHTML = '<img src="https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/BOOKY.TELIKO.HQ.png" alt="bot" />' + '<span>' + linkedText + '</span>';
      botSound.play().catch(() => {});
    } else {
      message.textContent = content;
    }
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  window.sendMessage = async () => {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, "user");
    userInput.value = "";

    const typing = document.createElement("div");
    typing.classList.add("message", "bot", "typing");
    typing.textContent = "Ο Mr Booky γράφει...";
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const res = await fetch("https://ui-api-for-github-160866660933.europe-west1.run.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id })
      });
      const data = await res.json();
      typing.remove();
      appendMessage(data.reply || "Λάβαμε μη αναμενόμενη απάντηση από τον server.", "bot");
    } catch (e) {
      typing.remove();
      appendMessage("Προέκυψε σφάλμα. Προσπαθήστε ξανά.", "bot");
    }
  };
})();
