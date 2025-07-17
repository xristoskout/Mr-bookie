(() => {
  // 💡 Material Icons
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  document.head.appendChild(link);

  // 🎨 CSS styling + continuous animation + glow ripple + tooltip + no blue outline
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
      border: none; margin: 0; padding: 0;
      border-radius: 50%;
      background-color: transparent;
      cursor: pointer;
      position: relative;
      z-index: 1001;
      transition: transform 0.3s ease;
      appearance: none;
      -webkit-tap-highlight-color: transparent;
      outline: none !important;
      box-shadow: none !important;
      overflow: visible;

      /* 🔁 Συνεχές animation — bounce + glow μαζί */
      animation: bounce 2.4s infinite ease-in-out;
    }
    .toggle-chatbox:active,
.toggle-chatbox:focus,
.toggle-chatbox:focus-visible {
  outline: none !important;
  box-shadow: none !important;
  background-color: transparent !important;
  background-image: url('https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/mrbooky.png') !important;
}
    .toggle-chatbox::-moz-focus-inner {
      border: 0 !important;
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
      top: -42px; left: 50%;
      transform: translateX(-50%);
      background: #111; color: #fff;
      padding: 6px 12px; font-size: 0.75rem;
      border-radius: 0.5rem;
      opacity: 0; pointer-events: none;
      transition: all 0.3s ease;
      white-space: nowrap;
      z-index: 1002;
    }
    .toggle-chatbox:hover .chat-tooltip {
      opacity: 1;
      transform: translate(-50%, -10px);
    }

    .chatbox {
      position: fixed;
      bottom: 6rem; left: 3.5rem;
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
    .message {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      max-width: 85%;
    }
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
    .message img {
      width: 28px;
      height: 28px;
      border-radius: 50%;
    }
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
        max-width: 100vw;
        max-height: 100svh;
        border-radius: 0;
        flex-direction: column;
        z-index: 1000;
      }
    }
  `;
  document.head.appendChild(style);

  // ✅ HTML markup – πλήρες widget με tooltip!
  const html = `
    <div class="chatbox-wrapper">
      <button class="toggle-chatbox" aria-label="Άνοιγμα συνομιλίας">
        <span class="chat-tooltip">💬 Chat Now</span>
      </button>
      <div class="chatbox" id="chatbox">
        <div class="chat-header">
          <div><strong>Mr Booky</strong><br/>
            <span style="font-size:0.65rem;font-weight:normal;">
              Powered by Taxi Express Patras
            </span>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;margin-left:auto;">
            <span class="material-icons close-chat-btn" title="Κλείσιμο" style="cursor:pointer;">close</span>
            <span class="material-icons clear-chat" title="Καθαρισμός" style="cursor:pointer;">delete_sweep</span>
          </div>
        </div>
        <div class="chat-messages" id="chat-messages"></div>
        <div class="input-area">
          <input type="text" id="user-input" placeholder="Πληκτρολογήστε..."/>
          <button id="send-btn" title="Αποστολή">
            <span class="material-icons">send</span>
          </button>
        </div>
      </div>
    </div>
    <audio id="botSound" src="https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/wet-431.mp3" preload="auto"></audio>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  // 🧩 JS logic 
  const chatbox = document.getElementById("chatbox");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const botSound = document.getElementById("botSound");
  const toggleBtn = document.querySelector(".toggle-chatbox");
  const closeBtn = document.querySelector(".close-chat-btn");
  const clearBtn = document.querySelector(".clear-chat");
  const sendBtn = document.getElementById("send-btn");

  let chatOpened = false;
  let session_id = localStorage.getItem("chat_session_id") || `sess-${Date.now()}`;
  localStorage.setItem("chat_session_id", session_id);

  function autoLinkify(text) {
     const safeText = text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const linkRegex = /((https?:\/\/[^\s<>()]+)|(tel:\+?\d+)|(mailto:([^\s<>()]+))|(www\.[^\s<>()]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}))/g;
    return safeText.replace(linkRegex, (match, p1, p2, p3, p4, mailTarget, p6, emailOnly) => {
      let cleanMatch = match.replace(/[.,?!;]+$/, "");
      let url = cleanMatch;
      let label = cleanMatch;
      let icon = "🔗";
      if (cleanMatch.startsWith("www.")) {
        url = "https://" + cleanMatch;
        icon = "🌐";
      }
      if (cleanMatch.startsWith("tel:")) {
        icon = "📞";
        label = cleanMatch.replace("tel:", "");
      }
      if (cleanMatch.startsWith("mailto:")) {
        icon = "📧";
        label = cleanMatch.replace("mailto:", "");
      }
      if (emailOnly) {
        icon = "📧";
        url = "mailto:" + emailOnly;
        label = emailOnly;
      }
      if (cleanMatch.includes("booking.infoxoros.com")) {
        icon = "🧾";
      }
      let html = `<a href="${url}" target="_blank" style="color:#2563eb;text-decoration:underline;">${icon} ${label}</a>`;
      if (cleanMatch.includes("booking.infoxoros.com")) {
        html += `<br><img src="https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=100x100" alt="QR Code" style="margin-top:6px;border-radius:8px;" />`;
      }
      return html;
    });
  }

  function appendMessage(content, sender) {
    const message = document.createElement("div");
    message.classList.add("message", sender);
    const bubble = document.createElement("span");
    bubble.innerHTML = autoLinkify(content);
    message.appendChild(bubble);
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (sender === "bot") {
      botSound.play().catch(() => {});
      const text = content.toLowerCase();
      const keywords = ["τηλέφωνο", "επικοινων", "καλέστε", "επικοινωνία", "επαφή", "telephone", "telefoon", "telefon", "telefono", "téléphone", "teléfono", "kommunikation", "kλήση", "oproep", "appel", "call", "chamada", "phone", "τηλεφώνησ"];
      const found = keywords.some(kw => text.includes(kw));
      if (found) {
        const phoneBtnWrapper = document.createElement("div");
        phoneBtnWrapper.classList.add("message", "bot");
        const phoneBtn = document.createElement("span");
        phoneBtn.innerHTML = `<a href="tel:2610450000" style="display:inline-block;margin-top:8px;padding:10px 16px;background:#f59e0b;color:white;border-radius:8px;text-decoration:none;font-weight:bold;">📞 Κλήση 2610450000</a>`;
        phoneBtnWrapper.appendChild(phoneBtn);
        chatMessages.appendChild(phoneBtnWrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }
    }
  }

  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, "user");
    userInput.value = "";

    const typing = document.createElement("div");
    typing.classList.add("message", "bot");
    const typingSpan = document.createElement("span");
    typingSpan.textContent = "Ο Mr Booky γράφει...";
    typing.appendChild(typingSpan);
    chatMessages.appendChild(typing);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const res = await fetch("https://ui-api-for-github-160866660933.europe-west1.run.app/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id })
      });
      typing.remove();
      const data = await res.json();
      appendMessage(data.reply || "Λάβαμε μη αναμενόμενη απάντηση από τον server.", "bot");
    } catch (e) {
      typing.remove();
      appendMessage("Προέκυψε σφάλμα. Προσπαθήστε ξανά.", "bot");
    }
  }

  function clearChat() {
    chatMessages.innerHTML = '';
    localStorage.removeItem("chat_session_id");
    session_id = "sess-" + Date.now();
    localStorage.setItem("chat_session_id", session_id);
    appendMessage("Η συνομιλία μηδενίστηκε. Ξεκινάμε από την αρχή.", "bot");
  }

  function toggleChat() {
    if (!chatbox.classList.contains("show")) {
      chatbox.classList.add("show");
      toggleBtn.style.display = "none";
      if (!chatOpened) {
        appendMessage("Καλώς ήρθατε! Είμαι ο Mr Booky. Πώς μπορώ να σας βοηθήσω;", "bot");
        chatOpened = true;
      }
    } else {
      chatbox.classList.remove("show");
      toggleBtn.style.display = "inline-block";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    toggleBtn.addEventListener("click", () => {
      toggleChat();
      toggleBtn.blur(); // ❌ Απομακρύνει focus για να μη βγαίνει μπλε
    });
    closeBtn?.addEventListener("click", toggleChat);
    clearBtn?.addEventListener("click", clearChat);
    sendBtn?.addEventListener("click", sendMessage);
    userInput?.addEventListener("keydown", e => e.key === "Enter" && sendMessage());
  });

  window.sendMessage = sendMessage;
  window.clearChat = clearChat;
})();

  window.sendMessage = sendMessage;
  window.clearChat = clearChat;
})();
