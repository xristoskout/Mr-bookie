(function () {
  const style = document.createElement("style");
  style.textContent = `
    .chatbox-wrapper {
      position: fixed;
      bottom: 1.5rem;
      left: 1.5rem;
      z-index: 1000;
    }
    .toggle-chatbox {
      background-image: url('https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/mrbooky.png');
      background-size: cover;
      background-position: center;
      width: 100px;
      height: 100px;
      border: none;
      margin: 0;
      padding: 0;
      border-radius: 50%;
      background-color: transparent;
      cursor: pointer;
      position: relative;
      z-index: 1001;
      transition: transform 0.3s ease;
      animation: bounce 2.4s infinite ease-in-out;
    }
    .toggle-chatbox::before {
      content: "";
      position: absolute;
      top: -12px;
      left: -12px;
      width: 124px;
      height: 124px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(253,186,116,0.4), transparent 70%);
      animation: glow 2.4s infinite ease-in-out;
      z-index: -1;
      pointer-events: none;
    }
    @keyframes bounce {
      0%,100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
    @keyframes glow {
      0%,100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.1; transform: scale(1.4); }
    }

    .chatbox {
      position: fixed;
      bottom: 6rem;
      left: 1.5rem;
      width: min(420px, 90vw);
      height: min(700px, 90vh);
      border-radius: 1.5rem;
      display: none;
      flex-direction: column;
      background-color: transparent;
      box-shadow: 0 10px 50px rgba(0,0,0,0.2);
      z-index: 1000;
      overflow: hidden;
    }
    .chatbox.show {
      display: flex;
    }
    .chat-header {
      background: linear-gradient(45deg, #fbbf24, #eab308, #fbbf24);
      padding: 1rem;
      font-weight: bold;
      font-size: 1rem;
      color: #1f2937;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .chat-messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background-image: url('https://raw.githubusercontent.com/xristoskout/gpt_mr_booky/main/docs/20250828_1833_%CE%9F%CE%B4%CE%B7%CE%B3%CF%8C%CF%82%20%CE%A4%CE%B1%CE%BE%CE%AF%20Mr%20Booky_remix_01k3rmv7ggf6cstnynmsxx21rp.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center;
    }
    .message {
      display: flex;
      max-width: 85%;
      gap: 0.5rem;
    }
    .message.bot { align-self: flex-start; flex-direction: row; }
    .message.user { align-self: flex-end; flex-direction: row-reverse; }
    .message span {
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      font-size: 0.9rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }
    .message.bot span {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #1f2937;
    }
    .message.user span {
      background: linear-gradient(135deg, #fb923c, #f59e0b);
      color: white;
    }
    .input-area {
      display: flex;
      gap: 0.5rem;
      padding: 1rem;
      background: rgba(255,255,255,0.98);
      backdrop-filter: blur(10px);
    }
    .input-area input {
      flex: 1;
      border: 1px solid #ccc;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      font-size: 1rem;
    }
    .input-area button {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, #fb923c, #f59e0b);
      border: none;
      border-radius: 1rem;
      color: white;
      font-size: 1.4rem;
      cursor: pointer;
    }
  `;
  document.head.appendChild(style);

  const wrapper = document.createElement("div");
  wrapper.className = "chatbox-wrapper";

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "toggle-chatbox";
  wrapper.appendChild(toggleBtn);

  const chatbox = document.createElement("div");
  chatbox.className = "chatbox";
  chatbox.id = "chatbox";
  chatbox.innerHTML = `
    <div class="chat-header">
      <div>
        <strong>Mr Booky</strong><br/>
        <span style="font-size: 0.65rem; font-weight: normal;">Powered by Taxi Express Patras</span>
      </div>
      <div>
        <span class="material-icons close-chat-btn" style="cursor:pointer;">close</span>
      </div>
    </div>
    <div class="chat-messages" id="chat-messages"></div>
    <div class="input-area">
      <input type="text" id="user-input" placeholder="Πληκτρολογήστε..." />
      <button id="send-btn"><span class="material-icons">send</span></button>
    </div>
  `;
  wrapper.appendChild(chatbox);
  document.body.appendChild(wrapper);

  const chatMessages = chatbox.querySelector("#chat-messages");
  const userInput = chatbox.querySelector("#user-input");
  const sendBtn = chatbox.querySelector("#send-btn");
  const closeBtn = chatbox.querySelector(".close-chat-btn");

  // Dummy backend
  const proxyUrl = "https://flask-agent-proxy-160866660933.europe-west1.run.app/api/agent";
  let sessionId = localStorage.getItem("chat_session_id") || `sess-${Date.now()}`;
  localStorage.setItem("chat_session_id", sessionId);

  const appendMessage = (text, sender) => {
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    const span = document.createElement("span");
    span.innerText = text;
    message.appendChild(span);
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const sendMessage = async () => {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, "user");
    userInput.value = "";

    appendMessage("...", "bot");

    try {
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId })
      });
      const data = await res.json();
      const botReply = data.reply || "Δεν υπάρχει απάντηση αυτή τη στιγμή.";
      const lastMsg = chatMessages.querySelector(".message.bot:last-child");
      lastMsg.querySelector("span").innerText = botReply;
    } catch (err) {
      const lastMsg = chatMessages.querySelector(".message.bot:last-child");
      lastMsg.querySelector("span").innerText = "⚠️ Σφάλμα σύνδεσης.";
    }
  };

  toggleBtn.addEventListener("click", () => {
    chatbox.classList.add("show");
    toggleBtn.style.display = "none";
    if (!chatMessages.querySelector(".message")) {
      appendMessage("👋 Καλώς ήρθατε! Είμαι ο Mr Booky!", "bot");
    }
  });

  closeBtn.addEventListener("click", () => {
    chatbox.classList.remove("show");
    toggleBtn.style.display = "inline-block";
  });

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });
})();
