
(() => {
  // 1️⃣ Material Icons
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  document.head.appendChild(link);

  // 2️⃣ CSS (πατάει πάνω στο παλιό + hard reset για κάθετο κείμενο)
  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; height: 100%; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }

    .chatbox, .chatbox * {
      writing-mode: horizontal-tb !important;
      text-orientation: mixed !important;
      direction: ltr !important;
      unicode-bidi: plaintext !important;
      white-space: normal !important;
      word-break: normal !important;
      overflow-wrap: anywhere !important;
      letter-spacing: normal !important;
    }

    .chatbox-wrapper {
      position: fixed;
      bottom: 1.5rem;
      left: 1.1rem;
      z-index: 10000;
    }
    .toggle-chatbox {
      background-image: url('https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/mrbooky.png');
      background-size: cover; background-position: center;
      width: 100px; height: 100px; border: none; margin: 0; padding: 0;
      border-radius: 50%; background-color: transparent; cursor: pointer;
      position: relative; z-index: 10001;
      transition: transform 0.3s ease; appearance: none !important;
      -webkit-tap-highlight-color: transparent !important;
      outline: none !important; box-shadow: none !important; overflow: visible;
      animation: bounce 2.4s infinite ease-in-out;
    }
    .toggle-chatbox::-moz-focus-inner { border: 0 !important; }
    .toggle-chatbox:focus, .toggle-chatbox:active, .toggle-chatbox:focus-visible {
      background-color: transparent !important;
      background-image: url('https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/mrbooky.png') !important;
      background-blend-mode: normal !important;
    }
    @keyframes bounce { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
    @keyframes glow { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.1; transform: scale(1.4); } }
    .toggle-chatbox::before {
      content: ""; position: absolute; top: -12px; left: -12px;
      width: 124px; height: 124px; border-radius: 50%;
      background: radial-gradient(circle, rgba(253,186,116,0.4), transparent 70%);
      animation: glow 2.4s infinite ease-in-out; z-index: -1; pointer-events: none;
    }
    .chat-tooltip {
      position: absolute; top: -42px; left: 50%; transform: translateX(-50%);
      background: #111; color: #fff; padding: 6px 18px; font-size: 0.75rem;
      border-radius: 0.5rem; opacity: 0; pointer-events: none; transition: all .8s ease;
      white-space: nowrap; z-index: 10002;
    }
    .toggle-chatbox:hover .chat-tooltip { opacity: 1; transform: translate(-50%, -10px); }

    .chatbox {
      position: fixed; bottom: 6rem; left: 3.5rem;
      width: min(420px, 90vw); height: min(750px, 90svh);
      max-width: calc(100vw - 3rem); max-height: calc(100vh - 7.5rem);
      border-radius: 1.5rem; overflow: hidden; display: none;
      background: #fff;
      background-image: url('https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/Ms%20Booky%20366x567.png');
      background-size: cover; background-repeat: no-repeat; background-position: center center;
      z-index: 10000; flex-direction: column;
    }
    .chatbox.show { display: flex; }

    .chat-header {
      background: linear-gradient(45deg, #fbbf24, #eab308, #fbbf24);
      padding: 1.25rem; display: flex; align-items: center; justify-content: space-between;
      font-weight: bold; font-size: 1.25rem; color: #1f2937;
    }
    .chat-messages {
      flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.75rem;
    }
    .message { display: flex; align-items: flex-start; gap: 0.5rem; max-width: 85%; }
    .message.bot { flex-direction: row; align-self: flex-start; }
    .message.user { flex-direction: row-reverse; align-self: flex-end; }

    .message span {
      display: inline-block; padding: 0.75rem 1rem; border-radius: 1rem;
      font-size: 0.95rem; line-height: 1.4; max-width: 100%;
    }
    .message.bot span { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #1f2937; border: 1px solid #fbbf24; }
    .message.user span { background: linear-gradient(135deg, #fb923c, #f59e0b); color: #fff; }
    .message.bot span a { color: #2563eb; text-decoration: underline; word-break: break-word; }

    .input-area {
      padding: 1rem; background: rgba(255,255,255,0.95); backdrop-filter: blur(10px);
      border-top: 1px solid #fbbf24; display: flex; gap: 0.75rem;
    }
    .input-area input {
      flex: 1; padding: 0.75rem 1rem; border: 1px solid #d1d5db; border-radius: 1rem; outline: none; color: #1f2937;
    }
    .input-area button {
      width: 3rem; height: 3rem; background: linear-gradient(135deg, #fb923c, #f59e0b);
      border: none; border-radius: 1rem; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all .2s ease;
    }
    .input-area button:hover { background: linear-gradient(135deg, #ea580c, #d97706); transform: scale(1.05); }

    .qr-wrap{ margin-top:8px; display:flex; align-items:center; gap:.5rem; }
    .qr-wrap canvas, .qr-wrap img{ width:110px; height:110px; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,.12); }
    .qr-label{ font-size:.85rem; color:#111; background:#fff7ed; padding:.35rem .5rem; border-radius:.5rem; }

    @media (max-width: 768px) {
      .chatbox {
        left: 0 !important; top: 0 !important; width: 100vw !important; height: 100svh !important;
        border-radius: 0 !important; max-width: 100vw !important; max-height: 100svh !important; z-index: 10000 !important;
      }
    }
  `;
  document.head.appendChild(style);

  // 3️⃣ HTML
  const html = `
    <div class="chatbox-wrapper">
      <button class="toggle-chatbox" tabindex="-1" aria-label="Άνοιγμα συνομιλίας">
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
          <button id="send-btn" title="Αποστολή"><span class="material-icons">send</span></button>
        </div>
      </div>
    </div>
    <audio id="botSound" src="https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/wet-431.mp3" preload="auto"></audio>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  // 4️⃣ DOM refs
  const chatbox = document.getElementById("chatbox");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const botSound = document.getElementById("botSound");
  const toggleBtn = document.querySelector(".toggle-chatbox");
  const closeBtn = document.querySelector(".close-chat-btn");
  const clearBtn = document.querySelector(".clear-chat");
  const sendBtn = document.getElementById("send-btn");

  // 5️⃣ Session
  let chatOpened = false;
  let session_id = localStorage.getItem("chat_session_id") || `sess-${Date.now()}`;
  localStorage.setItem("chat_session_id", session_id);

  // 6️⃣ Markdown + autolink + sanitize
  const mdLinksToHtml = (s) =>
    (s || "").replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, txt, url) => {
      const safeUrl = String(url).replace(/"/g, "&quot;");
      const safeTxt = String(txt).replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeTxt}</a>`;
    });

  function autoLinkify(text) {
    const safeText = String(text).replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const re = /((https?:\/\/[^\s<>()]+)|(tel:\+?\d+)|(mailto:([^\s<>()]+))|(www\.[^\s<>()]+)|([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}))/ig;
    const linked = safeText.replace(re, m => {
      let clean = m.replace(/[.,?!;]+$/, "");
      let url = clean, icon = "🔗";
      if (/^www\./i.test(clean)) { url = "https://" + clean; icon = "🌐"; }
      if (/^tel:/.test(clean)) { icon = "📞"; }
      if (/^mailto:/.test(clean) || /@/.test(clean)) {
        icon = "📧"; url = /^mailto:/.test(clean) ? clean : "mailto:" + clean;
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:#2563eb;text-decoration:underline;">${icon} ${clean}</a>`;
    });
    return mdLinksToHtml(linked);
  }

  // 7️⃣ QR helpers
  const loadQR = () => new Promise((resolve) => {
    if (window.QRCode) return resolve();
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = resolve; document.head.appendChild(s);
  });
  const QR_HOSTS = ["booking.infoxoros.com", "grtaxi.eu", "taxipatras.com"];
  const findLinks = (container) => Array.from(container.querySelectorAll("a[href^='http']"))
    .map(a => a.href).filter(href => { try { return QR_HOSTS.some(h => new URL(href).host.includes(h)); } catch { return false; }});
  async function renderQRBelow(container, urls) {
    if (!urls?.length) return;
    await loadQR();
    urls.forEach(u => {
      const wrap = document.createElement("div");
      wrap.className = "qr-wrap";
      const box = document.createElement("div");
      const label = document.createElement("span");
      label.className = "qr-label";
      label.textContent = "Σκάναρε για άμεση πρόσβαση";
      wrap.appendChild(box); wrap.appendChild(label);
      container.appendChild(wrap);
      new QRCode(box, { text: u, width: 110, height: 110, correctLevel: QRCode.CorrectLevel.M });
    });
  }

  // 8️⃣ Rendering
  function appendMessage(content, sender) {
    const m = document.createElement("div");
    m.className = "message " + sender;
    const bubble = document.createElement("span");

    // bot: rich; user: plain
    if (sender === "bot") {
      bubble.innerHTML = autoLinkify(content);
    } else {
      bubble.textContent = content;
    }

    m.appendChild(bubble);
    chatMessages.appendChild(m);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (sender === "bot") {
      botSound?.play?.().catch(() => {});
      // CTA για κλήση αν βλέπουμε τη λέξη ή τον αριθμό
      const txt = (content || "").toLowerCase();
      if (/(τηλέφων|call|κλήση)/i.test(content) || /2610450000/.test(content)) {
        const btn = document.createElement("div");
        btn.className = "message bot";
        btn.innerHTML = `<a href="tel:2610450000" style="display:inline-block;margin-top:8px;padding:10px 16px;background:#f59e0b;color:white;border-radius:8px;font-weight:bold;text-decoration:none;">📞 Κλήση 2610450000</a>`;
        chatMessages.appendChild(btn);
      }
      // QR για ειδικά links
      const urls = findLinks(bubble);
      renderQRBelow(m, urls);
    }
  }

  function renderBotResponse(payload) {
    // Παλιό DF payload (αν έρθει) – προαιρετικό
    if (payload.fulfillment_response?.messages) {
      payload.fulfillment_response.messages.forEach(msg => {
        if (msg.text?.text?.length) {
          const botMsg = document.createElement("div");
          botMsg.className = "message bot";
          const span = document.createElement("span");
          span.innerHTML = autoLinkify(msg.text.text[0]);
          botMsg.appendChild(span);
          chatMessages.appendChild(botMsg);
        }
      });
    }
    // Κουμπί για map_url
    if (payload.map_url) {
      const mapBtn = document.createElement("div");
      mapBtn.className = "message bot";
      const lang = payload.language_code || "el";
      const label = lang.startsWith("en") ? "📌 View route on map" : "📌 Δες τη διαδρομή στον χάρτη";
      mapBtn.innerHTML = `
        <a href="${payload.map_url}" target="_blank" rel="noopener noreferrer"
          style="display:inline-block;margin-top:8px;padding:10px 16px;background:#2547f3;color:white;border-radius:8px;font-weight:bold;text-decoration:none;transition:all .3s;">
          ${label}
        </a>`;
      const a = mapBtn.querySelector("a");
      a.addEventListener("click", (e) => { e.preventDefault(); e.stopPropagation(); window.open(a.href, "_blank", "noopener,noreferrer"); });
      a.setAttribute("role","button"); a.setAttribute("tabindex","0");
      a.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.open(a.href, "_blank", "noopener,noreferrer"); }});
      chatMessages.appendChild(mapBtn);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 9️⃣ Send flow
  async function sendMessage() {
    const txt = userInput.value.trim();
    if (!txt) return;
    appendMessage(txt, "user");
    userInput.value = "";

    const t = document.createElement("div");
    t.className = "message bot";
    t.innerHTML = "<span>Ο Mr Booky γράφει...</span>";
    chatMessages.appendChild(t);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const res = await fetch("https://flask-agent-proxy-160866660933.europe-west1.run.app/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: txt, session_id })
      });
      const data = await res.json();
      t.remove();
      appendMessage(data.reply || "Λάθος απάντηση", "bot");
      renderBotResponse(data);
    } catch (e) {
      t.remove();
      appendMessage("❌ Σφάλμα — δοκίμασε ξανά", "bot");
    }
  }

  // 🔟 Clear
  function clearChat() {
    chatMessages.innerHTML = "";
    localStorage.removeItem("chat_session_id");
    session_id = `sess-${Date.now()}`;
    localStorage.setItem("chat_session_id", session_id);
    appendMessage("🧹 Συνομιλία μηδενίστηκε.", "bot");
  }

  // 1️⃣1️⃣ Toggle
  function toggleChat() {
    if (!chatbox.classList.contains("show")) {
      chatbox.classList.add("show");
      toggleBtn.style.display = "none";
      if (!chatOpened) {
        appendMessage("👋 Καλώς ήρθες! Είμαι ο Mr Booky.", "bot");
        chatOpened = true;
      }
    } else {
      chatbox.classList.remove("show");
      toggleBtn.style.display = "inline-block";
    }
  }

  // 1️⃣2️⃣ Listeners
  document.addEventListener("DOMContentLoaded", () => {
    toggleBtn?.addEventListener("click", () => { toggleChat(); setTimeout(() => toggleBtn.blur(), 1); });
    closeBtn?.addEventListener("click", toggleChat);
    clearBtn?.addEventListener("click", clearChat);
    sendBtn?.addEventListener("click", sendMessage);
    userInput?.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
  });

  // export (προαιρετικά)
  window.sendMessage = sendMessage;
  window.clearChat = clearChat;
})();






