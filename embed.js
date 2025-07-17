(() => {
  // 1️⃣ Φόρτωση Material Icons
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  document.head.appendChild(link);

  // 2️⃣ Ενσωμάτωση CSS
  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; height: 100%; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }

    .chatbox-wrapper {
      position: fixed;
      bottom: 5.5rem;
      left: 1.1rem;
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
      appearance: none !important;
      -webkit-tap-highlight-color: transparent !important;
      outline: none !important;
      box-shadow: none !important;
      overflow: visible;
      animation: bounce 2.4s infinite ease-in-out;
    }
    .toggle-chatbox::-moz-focus-inner { border: 0 !important; }
    .toggle-chatbox:focus,
    .toggle-chatbox:active,
    .toggle-chatbox:focus-visible {
      background-color: transparent !important;
      background-image: url('https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/mrbooky.png') !important;
      background-blend-mode: normal !important;
    }
    @keyframes bounce {
      0%,100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
    @keyframes glow {
      0%,100% { opacity: 0.4; transform: scale(1); }
      50% { opacity: 0.1; transform: scale(1.4); }
    }
    .toggle-chatbox::before {
      content: "";
      position: absolute;
      top: -12px; left: -12px;
      width: 124px; height: 124px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(253,186,116,0.4), transparent 70%);
      animation: glow 2.4s infinite ease-in-out;
      z-index: -1;
      pointer-events: none;
    }
    .chat-tooltip {
      position: absolute;
      top: -42px;
      left: 50%;
      transform: translateX(-50%);
      background: #111;
      color: #fff;
      padding: 6px 18px;
      font-size: 0.75rem;
      border-radius: 0.5rem;
      opacity: 0;
      pointer-events: none;
      transition: all 0.8s ease;
      white-space: nowrap;
      z-index: 1002;
    }
    .toggle-chatbox:hover .chat-tooltip {
      opacity: 1;
      transform: translate(-50%, -10px);
    }
    .chatbox {
      position: fixed;
      bottom: 6rem;
      left: 3.5rem;
      width: min(420px, 90vw);
      height: min(750px, 90svh);
      max-width: calc(100vw - 3rem);
      max-height: calc(100vh - 7.5rem);
      border-radius: 1.5rem;
      overflow: hidden;
      display: none;
      background-color: white;
      background-image: url('https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/Ms%20Booky%20366x567.png');
      background-size: cover;
      background-repeat: no-repeat;
      background-position: center center;
      z-index: 1000;
      flex-direction: column;
    }
    .chatbox.show { display: flex; }
    .chat-header {
      background: linear-gradient(45deg, #fbbf24, #eab308, #fbbf24);
      padding: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-weight: bold;
      font-size: 1.25rem;
      color: #1f2937;
    }
    .chat-messages {
      flex: 1;
      padding: 1rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .message { display: flex; align-items: flex-start; gap: 0.5rem; max-width: 85%; }
    .message.bot { flex-direction: row; align-self: flex-start; }
    .message.user { flex-direction: row-reverse; align-self: flex-end; }
    .message span {
      display: inline-block;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      font-size: 0.95rem;
      line-height: 1.4;
    }
    .message.bot span {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #1f2937;
      border: 1px solid #fbbf24;
    }
    .message.user span {
      background: linear-gradient(135deg, #fb923c, #f59e0b);
      color: white;
    }
    .message img { width: 28px; height: 28px; border-radius: 50%; }
    .input-area {
      padding: 1rem;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      border-top: 1px solid #fbbf24;
      display: flex;
      gap: 0.75rem;
    }
    .input-area input {
      flex: 1;
      padding: 0.75rem 1rem;
      border: 1px solid #d1d5db;
      border-radius: 1rem;
      outline: none;
      color: #1f2937;
    }
    .input-area button {
      width: 3rem;
      height: 3rem;
      background: linear-gradient(135deg, #fb923c, #f59e0b);
      border: none;
      border-radius: 1rem;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }
    .input-area button:hover {
      background: linear-gradient(135deg, #ea580c, #d97706);
      transform: scale(1.05);
    }
    @media (max-width: 768px) {
      .chatbox {
        top: 0;
        left: 0;
        width: 100vw;
        height: 100svh;
        border-radius: 0;
      }
    }
  `;
  document.head.appendChild(style);

  // 3️⃣ HTML markup
  const html = `
    <div class="chatbox-wrapper">
      <button class="toggle-chatbox" aria-label="Άνοιγμα συνομιλίας">
        <span class="chat-tooltip">💬 Chat Now</span>
      </button>
      <div class="chatbox" id="chatbox">
        <div class="chat-header">
          <div><strong>Mr Booky</strong><br/>
            <span style="font-size:0.65rem;font-weight:normal;">Powered by Taxi Express Patras</span>
          </div>
          <div style="display:flex;gap:0.5rem;align-items:center;margin-left:auto;">
            <span class="material-icons close-chat-btn" title="Κλείσιμο" style="cursor:pointer;">close</span>
            <span class="material-icons clear-chat" title="Καθαρισμός" style="cursor:pointer;">delete_sweep</span>
          </div>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="input-area">
          <input type="text" id="user-input" placeholder="Πληκτρολογήστε…"/>
          <button id="send-btn" title="Αποστολή">
            <span class="material-icons">send</span>
          </button>
        </div>
      </div>
    </div>
    <audio id="botSound" src="https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/wet-431.mp3" preload="auto"></audio>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  // 4️⃣ Επιλογή στοιχείων
  const chatbox = document.getElementById("chatbox");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const botSound = document.getElementById("botSound");
  const toggleBtn = document.querySelector(".toggle-chatbox");
  const closeBtn = document.querySelector(".close-chat-btn");
  const clearBtn = document.querySelector(".clear-chat");
  const sendBtn = document.getElementById("send-btn");

  // 5️⃣ Λογική
  let chatOpened = false;
  let session_id = localStorage.getItem("chat_session_id") || `sess-${Date.now()}`;
  localStorage.setItem("chat_session_id", session_id);

  function autoLinkify(text) {
    // ίδια λογική όπως πριν
    const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const re = /((https?:\/\/[^\s<>()]+)|(tel:\+?\d+)|(mailto:([^\s<>()]+))|(www\.[^\s<>()]+)|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}))/ig;
    return safeText.replace(re, m => {
      let clean = m.replace(/[.,?!;]+$/, "");
      let url = clean, icon = "🔗";
      if (/^www\./i.test(clean)) { url = "https://" + clean; icon="🌐"; }
      if (/^tel:/.test(clean)) { icon="📞"; }
      if (/^mailto:/.test(clean) || /@/.test(clean)) { icon="📧"; url = /^mailto:/.test(clean)?clean:"mailto:"+clean; }
      return `<a href="${url}" target="_blank" style="color:#2563eb;text-decoration:underline;">${icon} ${clean}</a>`;
    });
  }

  function appendMessage(content, sender) {
    const m = document.createElement("div");
    m.className = "message " + sender;
    const bubble = document.createElement("span");
    bubble.innerHTML = autoLinkify(content);
    m.appendChild(bubble);
    chatMessages.appendChild(m);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    if (sender==="bot") {
      botSound.play().catch(()=>{});
      if (/τηλέφωνο|call|κλήση/i.test(content)) {
        const btn = document.createElement("div");
        btn.className="message bot";
        btn.innerHTML = `<a href="tel:2610450000" style="display:inline-block;margin-top:8px;padding:10px 16px;background:#f59e0b;color:white;border-radius:8px;font-weight:bold;text-decoration:none;">📞 Κλήση 2610450000</a>`;
        chatMessages.appendChild(btn);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }
  }

  async function sendMessage() {
    const txt = userInput.value.trim(); if(!txt) return;
    appendMessage(txt, "user");
    userInput.value = "";
    const t = document.createElement("div");
    t.className="message bot"; t.innerHTML="<span>Ο Mr Booky γράφει...</span>";
    chatMessages.appendChild(t);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    try {
      const res = await fetch("https://ui-api-for-github-160866660933.europe-west1.run.app/chat", {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({message:txt,session_id})
      });
      const data = await res.json();
      t.remove();
      appendMessage(data.reply||"Λάθος απάντηση", "bot");
    } catch(e) {
      t.remove();
      appendMessage("Σφάλμα — δοκίμασε ξανά", "bot");
    }
  }

  function clearChat() {
    chatMessages.innerHTML="";
    localStorage.removeItem("chat_session_id");
    session_id = `sess-${Date.now()}`;
    localStorage.setItem("chat_session_id", session_id);
    appendMessage("Συνομιλία μηδενίστηκε.", "bot");
  }

  function toggleChat() {
    if (!chatbox.classList.contains("show")) {
      chatbox.classList.add("show");
      toggleBtn.style.display="none";
      if (!chatOpened) {
        appendMessage("Καλώς ήρθατε! Είμαι ο Mr Booky.", "bot");
        chatOpened=true;
      }
    } else {
      chatbox.classList.remove("show");
      toggleBtn.style.display="inline-block";
    }
  }

  // 6️⃣ Event listeners
  document.addEventListener("DOMContentLoaded", () => {
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        toggleChat();
        setTimeout(() => toggleBtn.blur(), 1);
      });
    }
    if (closeBtn) closeBtn.addEventListener("click", toggleChat);
    if (clearBtn) clearBtn.addEventListener("click", clearChat);
    if (sendBtn) sendBtn.addEventListener("click", sendMessage);
    if (userInput) userInput.addEventListener("keydown", e => {
      if (e.key === "Enter") sendMessage();
    });
  });

  // 7️⃣ Global exports
  window.sendMessage = sendMessage;
  window.clearChat = clearChat;
})();
