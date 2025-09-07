
(() => {
  // 1) Material Icons
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  document.head.appendChild(link);

  // 2) CSS
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

    .chatbox-wrapper { position: fixed; bottom: 1.5rem; left: 1.1rem; z-index: 10000; }
    .toggle-chatbox {
      background-image: url('https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/mrbooky.png');
      background-size: cover; background-position: center;
      width: 100px; height: 100px; border: none; margin: 0; padding: 0;
      border-radius: 50%; background-color: transparent; cursor: pointer;
      position: relative; z-index: 10001; transition: transform .3s ease;
      appearance: none !important; -webkit-tap-highlight-color: transparent !important;
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
    @keyframes glow { 0%,100% { opacity: .4; transform: scale(1); } 50% { opacity: .1; transform: scale(1.4); } }
    .toggle-chatbox::before {
      content: ""; position: absolute; top: -12px; left: -12px; width: 124px; height: 124px; border-radius: 50%;
      background: radial-gradient(circle, rgba(253,186,116,0.4), transparent 70%); animation: glow 2.4s infinite ease-in-out;
      z-index: -1; pointer-events: none;
    }
    .chat-tooltip {
      position: absolute; top: -42px; left: 50%; transform: translateX(-50%);
      background: #111; color: #fff; padding: 6px 18px; font-size: .75rem; border-radius: .5rem;
      opacity: 0; pointer-events: none; transition: all .8s ease; white-space: nowrap; z-index: 10002;
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
    .chat-messages { flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: .75rem; }
    .message { display: flex; align-items: flex-start; gap: .5rem; max-width: 85%; }
    .message.bot { flex-direction: row; align-self: flex-start; }
    .message.user { flex-direction: row-reverse; align-self: flex-end; }
    .message span { display: inline-block; padding: .75rem 1rem; border-radius: 1rem; font-size: .95rem; line-height: 1.4; max-width: 100%; }
    .message.bot span { background: linear-gradient(135deg, #fef3c7, #fde68a); color: #1f2937; border: 1px solid #fbbf24; }
    .message.user span { background: linear-gradient(135deg, #fb923c, #f59e0b); color: #fff; }
    .message.bot span a { color: #2563eb; text-decoration: underline; word-break: break-word; }

    .input-area {
      padding: 1rem; background: rgba(255,255,255,.95); backdrop-filter: blur(10px);
      border-top: 1px solid #fbbf24; display: flex; gap: .75rem;
    }
    .input-area input { flex: 1; padding: .75rem 1rem; border: 1px solid #d1d5db; border-radius: 1rem; outline: none; color: #1f2937; }
    .input-area button {
      width: 3rem; height: 3rem; background: linear-gradient(135deg, #fb923c, #f59e0b);
      border: none; border-radius: 1rem; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all .2s ease;
    }
    .input-area button:hover { background: linear-gradient(135deg, #ea580c, #d97706); transform: scale(1.05); }

    @media (max-width: 768px) {
      .chatbox {
        left: 0 !important; top: 0 !important; width: 100vw !important; height: 100svh !important;
        border-radius: 0 !important; max-width: 100vw !important; max-height: 100svh !important; z-index: 10000 !important;
      }
    }
  `;
  document.head.appendChild(style);

  // 3) HTML
  const html = `
    <div class="chatbox-wrapper">
      <button class="toggle-chatbox" tabindex="-1" aria-label="Άνοιγμα συνομιλίας">
        <span class="chat-tooltip">💬 Chat Now</span>
      </button>
      <div class="chatbox" id="chatbox">
        <div class="chat-header">
          <div><strong>Mr Booky</strong><br/>
            <span style="font-size:.65rem;font-weight:normal;">Powered by Taxi Express Patras</span>
          </div>
          <div style="display:flex;gap:.5rem;align-items:center;margin-left:auto;">
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

  // 4) DOM refs
  const chatbox = document.getElementById("chatbox");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const botSound = document.getElementById("botSound");
  const toggleBtn = document.querySelector(".toggle-chatbox");
  const closeBtn = document.querySelector(".close-chat-btn");
  const clearBtn = document.querySelector(".clear-chat");
  const sendBtn = document.getElementById("send-btn");

  // 5) Session
  let chatOpened = false;
  let session_id = localStorage.getItem("chat_session_id") || `sess-${Date.now()}`;
  localStorage.setItem("chat_session_id", session_id);

  // 6) Markdown-to-plainText-with-URL (χωρίς αγκύλες)
  const mdLinksToHtml = (s) =>
    (s || "").replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, txt, rawUrl) => {
      // καθάρισε "🔗 " αν υπάρχει μέσα στην παρενθέση
      let cleanUrl = String(rawUrl).replace(/^🔗\s*/i, "").trim();
      if (/^www\./i.test(cleanUrl)) cleanUrl = "https://" + cleanUrl;
      const safeTxt = String(txt).replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const safeUrl = cleanUrl.replace(/"/g, "&quot;");
      // Παράγουμε: κείμενο (🔗 url) όπου το url είναι clickable
      return `${safeTxt} (<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">🔗 ${safeUrl}</a>)`;
    });

  // 6b) Auto-linker για γυμνά urls/emails/τηλέφωνα (προστασία υπαρχόντων <a>)
  function autoLinkify(input) {
    // 1) Μετατροπή markdown πρώτα
    let text = mdLinksToHtml(String(input));

    // 2) Προστάτεψε ήδη-δημιουργημένα anchors
    const anchors = [];
    text = text.replace(/<a\b[^>]*>.*?<\/a>/gis, (m) => {
      anchors.push(m);
      return `__A${anchors.length - 1}__`;
    });

    // 3) Linkify τα υπόλοιπα καθαρά κείμενα
    //   - URLs, www., emails, tel:
    text = text
      .replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/((https?:\/\/[^\s<>()]+))/ig, (m) =>
        `<a href="${m}" target="_blank" rel="noopener noreferrer">🔗 ${m}</a>`)
      .replace(/\b(www\.[^\s<>()]+)\b/ig, (m) => {
        const url = "https://" + m;
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">🌐 ${m}</a>`;
      })
      .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/ig, (m) =>
        `<a href="mailto:${m}" target="_blank" rel="noopener noreferrer">📧 ${m}</a>`)
      .replace(/\btel:\+?\d+\b/ig, (m) =>
        `<a href="${m}" target="_blank" rel="noopener noreferrer">📞 ${m.replace(/^tel:/i,"")}</a>`)
      // Ελληνικοί αριθμοί τηλεφώνου: 10ψήφιος, δέχεται κενά/παύλες (π.χ. 2610 450000)
      .replace(/\b(2\d{3})[ -]?(\d{6})\b/g, (m, p1, p2) => {
        const digits = `${p1}${p2}`;
        const e164 = `+30${digits}`;
        return `<a href="tel:${e164}" target="_blank" rel="noopener noreferrer">📞 ${p1} ${p2}</a>`;
      });

    // 4) Επαναφορά anchors
    text = text.replace(/__A(\d+)__/g, (_, i) => anchors[Number(i)]);

    return text;
  }

  // 7) Rendering
  function appendMessage(content, sender) {
    const m = document.createElement("div");
    m.className = "message " + sender;
    const bubble = document.createElement("span");

    if (sender === "bot") {
      bubble.innerHTML = autoLinkify(content);
    } else {
      bubble.textContent = content;
    }

    m.appendChild(bubble);
    chatMessages.appendChild(m);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // CTA για κλήση – αναγνώριση και με κενά/emoji
    if (sender === "bot") {
      const hasCallWord = /(τηλέφων|call|κλήση)/i.test(content);
      const hasNumber = /(2610[\s-]?45\s?0000|2610450000)/.test(content);
      if (hasCallWord || hasNumber) {
        const btn = document.createElement("div");
        btn.className = "message bot";
        btn.innerHTML = `
          <a href="tel:+302610450000"
             style="display:inline-block;margin-top:8px;padding:10px 16px;background:#f59e0b;color:white;border-radius:8px;font-weight:bold;text-decoration:none;">
            📞 Κλήση 2610450000
          </a>`;
        chatMessages.appendChild(btn);
      }
      botSound?.play?.().catch(() => {});
    }
  }

  function renderBotResponse(payload) {
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

  // 8) Send flow
  async function sendMessage() {
  const txt = userInput.value.trim();
  if (!txt) return;
  appendMessage(txt, "user");
  userInput.value = "";

  const t = document.createElement("div");
t.className = "message bot";
t.innerHTML = `
  <div class="typing-bubble" style="display: flex; justify-content: center;">
    <svg width="60" height="20" viewBox="0 0 60 20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <circle cx="10" cy="10" r="6" fill="#34d399" filter="url(#glow)">
        <animate attributeName="r" values="5;7;5" dur="1.2s" repeatCount="indefinite" begin="0s"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" begin="0s"/>
      </circle>

      <circle cx="30" cy="10" r="6" fill="#facc15" filter="url(#glow)">
        <animate attributeName="r" values="5;7;5" dur="1.2s" repeatCount="indefinite" begin="0.2s"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" begin="0.2s"/>
      </circle>

      <circle cx="50" cy="10" r="6" fill="#f87171" filter="url(#glow)">
        <animate attributeName="r" values="5;7;5" dur="1.2s" repeatCount="indefinite" begin="0.4s"/>
        <animate attributeName="opacity" values="0.4;1;0.4" dur="1.2s" repeatCount="indefinite" begin="0.4s"/>
      </circle>
    </svg>
  </div>
`;

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




  // 9) Clear
  function clearChat() {
    chatMessages.innerHTML = "";
    localStorage.removeItem("chat_session_id");
    session_id = `sess-${Date.now()}`;
    localStorage.setItem("chat_session_id", session_id);
    appendMessage("🧹 Συνομιλία μηδενίστηκε.", "bot");
  }

  // 10) Toggle
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

  // 11) Listeners
  document.addEventListener("DOMContentLoaded", () => {
    toggleBtn?.addEventListener("click", () => { toggleChat(); setTimeout(() => toggleBtn.blur(), 1); });
    closeBtn?.addEventListener("click", toggleChat);
    clearBtn?.addEventListener("click", clearChat);
    sendBtn?.addEventListener("click", sendMessage);
    userInput?.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
  });

  // (optional) export
  window.sendMessage = sendMessage;
  window.clearChat = clearChat;
})();













