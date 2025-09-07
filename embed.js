// embed.js
document.addEventListener("DOMContentLoaded", () => {
  // 1) Φόρτωση Material Icons
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  document.head.appendChild(link);

  // 2) CSS + animation + glow
  const style = document.createElement("style");
  style.textContent = `
    *, *::before, *::after { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; height: 100%; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }

    .typing-bubble {
      display: inline;
      font-size: 16px;
      color: #444;
      animation: pulse-glow 2s infinite ease-in-out;
    }
    .typing-dots {
      display: inline-flex;
      gap: 4px;
      margin-left: 8px;
      vertical-align: middle;
    }
    .typing-dots span {
      display: inline-block;
      animation: bounce 1.4s infinite ease-in-out;
    }
    .typing-dots span:nth-child(1) { animation-delay: 0s; }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes bounce {
      0%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-8px); }
    }
    @keyframes pulse-glow {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
        text-shadow: 0 0 4px rgba(253,224,71,0.5);
      }
      50% {
        opacity: 0.8;
        transform: scale(1.02);
        text-shadow: 0 0 12px rgba(253,224,71,0.8);
      }
    }

    .chatbox-wrapper { position: fixed; bottom: 1.5rem; left: 1.1rem; z-index: 10000; }
    .toggle-chatbox {
      background-image: url('https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/mrbooky.png');
      background-size: cover; background-position: center;
      width: 100px; height: 100px; border: none;
      border-radius: 50%; background-color: transparent; cursor: pointer;
      position: relative; z-index: 10001; transition: transform .3s ease;
      appearance: none !important; -webkit-tap-highlight-color: transparent !important;
      outline: none !important; box-shadow: none !important; overflow: visible;
      animation: bounce-btn 2.4s infinite ease-in-out;
    }
    @keyframes bounce-btn {
      0%,100% { transform: scale(1); }
      50% { transform: scale(1.15); }
    }
    .toggle-chatbox::before {
      content: ""; position: absolute; top: -12px; left: -12px; width: 124px; height: 124px; border-radius: 50%;
      background: radial-gradient(circle, rgba(253,186,116,0.4), transparent 70%);
      animation: glow 2.4s infinite ease-in-out;
      z-index: -1; pointer-events: none;
    }
    @keyframes glow {
      0%,100% { opacity: .4; transform: scale(1); }
      50% { opacity: .1; transform: scale(1.4); }
    }
    .chat-tooltip {
      position: absolute; top: -42px; left: 50%; transform: translateX(-50%);
      background: #111; color: #fff; padding: 6px 18px; font-size: .75rem; border-radius: .5rem;
      opacity: 0; pointer-events: none; transition: all .8s ease; white-space: nowrap; z-index: 10002;
    }
    .toggle-chatbox:hover .chat-tooltip {
      opacity: 1; transform: translate(-50%, -10px);
    }
    .chatbox {
      position: fixed; bottom: 6rem; left: 3.5rem;
      width: min(420px, 90vw); height: min(750px, 90svh);
      max-width: calc(100vw - 3rem); max-height: calc(100vh - 7.5rem);
      border-radius: 1.5rem; overflow: hidden; display: none;
      background: #fff;
      background-image: url('https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/Ms%20Booky%20366x567.png');
      background-size: cover; background-position: center center;
      z-index: 10000; flex-direction: column;
    }
    .chatbox.show { display: flex; }
    .chat-header {
      background: linear-gradient(45deg, #fbbf24, #eab308, #fbbf24);
      padding: 1.25rem; display: flex; align-items: center; justify-content: space-between;
      font-weight: bold; font-size: 1.25rem; color: #1f2937;
    }
    .chat-messages { flex: 1; padding: 1rem; overflow-y: auto;
      display: flex; flex-direction: column; gap: .75rem;
    }
    .message { display: flex; align-items: flex-start; gap: .5rem; max-width: 85%; }
    .message.bot { flex-direction: row; align-self: flex-start; }
    .message.user { flex-direction: row-reverse; align-self: flex-end; }
    .message span {
      display: inline-block; padding: .75rem 1rem; border-radius: 1rem;
      font-size: .95rem; line-height: 1.4; max-width: 100%;
    }
    .message.bot span {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #1f2937; border: 1px solid #fbbf24;
    }
    .message.user span {
      background: linear-gradient(135deg, #fb923c, #f59e0b);
      color: #fff;
    }
    .message.bot span a { color: #2563eb; text-decoration: underline; }
    .input-area {
      padding: 1rem; background: rgba(255,255,255,.95); backdrop-filter: blur(10px);
      border-top: 1px solid #fbbf24; display: flex; gap: .75rem;
    }
    .input-area input {
      flex: 1; padding: .75rem 1rem; border: 1px solid #d1d5db;
      border-radius: 1rem; outline: none; color: #1f2937;
    }
    .input-area button {
      width: 3rem; height: 3rem; background: linear-gradient(135deg, #fb923c, #f59e0b);
      border: none; border-radius: 1rem; color: #fff;
      cursor: pointer; display: flex; align-items: center; justify-content: center;
      transition: all .2s ease;
    }
    .input-area button:hover {
      background: linear-gradient(135deg, #ea580c, #d97706);
      transform: scale(1.05);
    }
    @media (max-width: 768px) {
      .chatbox {
        left: 0 !important; top: 0 !important;
        width: 100vw !important; height: 100svh !important;
        border-radius: 0 !important;
      }
    }
  `;
  document.head.appendChild(style);

  // 3) HTML embed
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
          <button id="send-btn" title="Αποστολή">
            <span class="material-icons">send</span>
          </button>
        </div>
      </div>
    </div>
    <audio id="botSound" src="https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/wet-431.mp3" preload="auto"></audio>
    <audio id="typingSound" src="https://raw.githubusercontent.com/xristoskout/Mr-bookie/main/soft-type-loop.mp3" preload="auto" loop></audio>
  `;
  document.body.insertAdjacentHTML("beforeend", html);

  // 4) Now select elements
  const chatbox = document.getElementById("chatbox");
  const chatMessages = document.getElementById("chat-messages");
  const userInput = document.getElementById("user-input");
  const botSound = document.getElementById("botSound");
  const typingSound = document.getElementById("typingSound");
  const toggleBtn = document.querySelector(".toggle-chatbox");
  const closeBtn = document.querySelector(".close-chat-btn");
  const clearBtn = document.querySelector(".clear-chat");
  const sendBtn = document.getElementById("send-btn");

  // 5) Session
  let chatOpened = false;
  let session_id = localStorage.getItem("chat_session_id") || \`sess-\${Date.now()}\`;
  localStorage.setItem("chat_session_id", session_id);

  // 6) Markdown & autolink
  const mdLinksToHtml = s => (s || "").replace(/\\[([^\\]]+)\\]\\(([^)]+)\\)/g, (_, txt, rawUrl) => {
    let cleanUrl = rawUrl.replace(/^🔗\\s*/i, "").trim();
    if (/^www\\./i.test(cleanUrl)) cleanUrl = "https://" + cleanUrl;
    const safeTxt = txt.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const safeUrl = cleanUrl.replace(/"/g, "&quot;");
    return \`\${safeTxt} (<a href="\${safeUrl}" target="_blank" rel="noopener noreferrer">🔗 \${safeUrl}</a>)\`;
  });

  function autoLinkify(input) {
    let text = mdLinksToHtml(String(input));
    const anchors = [];
    text = text.replace(/<a\\b[^>]*>.*?<\\/a>/gis, m => {
      anchors.push(m);
      return \`__A\${anchors.length - 1}__\`;
    });
    text = text
      .replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/((https?:\\/\\/[^\\s<>()]+))/ig, m => \`<a href="\${m}" target="_blank" rel="noopener noreferrer">🔗 \${m}</a>\`)
      .replace(/\\b(www\\.[^\\s<>()]+)\\b/ig, m => \`<a href="https://\${m}" target="_blank" rel="noopener noreferrer">🌐 \${m}</a>\`)
      .replace(/\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b/ig, m => \`<a href="mailto:\${m}" target="_blank" rel="noopener noreferrer">📧 \${m}</a>\`)
      .replace(/\\btel:\\+?\\d+\\b/ig, m => \`<a href="\${m}" target="_blank" rel="noopener noreferrer">📞 \${m.replace(/^tel:/i,"")}</a>\`)
      .replace(/\\b(2\\d{3})[ -]?(\\d{6})\\b/g, (m, p1, p2) => {
        const digits = p1 + p2;
        const e164 = "+30" + digits;
        return \`<a href="tel:\${e164}" target="_blank" rel="noopener noreferrer">📞 \${p1} \${p2}</a>\`;
      });
    return text.replace(/__A(\\d+)__/g, (_, i) => anchors[Number(i)]);
  }

  // 7) appendMessage
  function appendMessage(content, sender) {
    const m = document.createElement("div");
    m.className = "message " + sender;
    const bubble = document.createElement("span");
    bubble.innerHTML = sender === "bot" ? autoLinkify(content) : content;
    m.appendChild(bubble);
    chatMessages.appendChild(m);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    if (sender === "bot") {
      const hasCall = /(τηλέφων|call|κλήση)/i.test(content);
      const hasNum = /(2610[\\s-]?45\\s?0000|2610450000)/.test(content);
      if (hasCall || hasNum) {
        const btn = document.createElement("div");
        btn.className = "message bot";
        btn.innerHTML = \`
          <a href="tel:+302610450000"
             style="display:inline-block;margin-top:8px;padding:10px 16px;background:#f59e0b;color:white;border-radius:8px;font-weight:bold;text-decoration:none;">
            📞 Κλήση 2610450000
          </a>\`;
        chatMessages.appendChild(btn);
      }
      botSound?.play?.().catch(() => {});
    }
  }

  // 8) renderBotResponse
  function renderBotResponse(payload) {
    payload.fulfillment_response?.messages?.forEach(msg => {
      if (msg.text?.text?.[0]) {
        const botMsg = document.createElement("div");
        botMsg.className = "message bot";
        const span = document.createElement("span");
        span.innerHTML = autoLinkify(msg.text.text[0]);
        botMsg.appendChild(span);
        chatMessages.appendChild(botMsg);
      }
    });
    if (payload.map_url) {
      const mapBtn = document.createElement("div");
      mapBtn.className = "message bot";
      const lang = payload.language_code || "el";
      const label = lang.startsWith("en") ? "📌 View route on map" : "📌 Δες τη διαδρομή στον χάρτη";
      mapBtn.innerHTML = \`
        <a href="\${payload.map_url}" target="_blank" rel="noopener noreferrer"
           style="display:inline-block;margin-top:8px;padding:10px 16px;background:#2547f3;color:white;border-radius:8px;font-weight:bold;text-decoration:none;transition:all .3s;">
          \${label}
        </a>\`;
      const a = mapBtn.querySelector("a");
      a.addEventListener("click", e => { e.preventDefault(); window.open(a.href, "_blank", "noopener,noreferrer"); });
      a.setAttribute("role","button"); a.setAttribute("tabindex","0");
      a.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); window.open(a.href, "_blank", "noopener,noreferrer"); }});
      chatMessages.appendChild(mapBtn);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // 9) sendMessage with typing sound & animated bubble
  async function sendMessage() {
    const txt = userInput.value.trim();
    if (!txt) return;
    appendMessage(txt, "user");
    userInput.value = "";

    const t = document.createElement("div");
    t.className = "message bot";
    t.innerHTML = \`
      <div class="typing-bubble">
        Ο Mr Booky γράφει
        <span class="typing-dots">
          <span>🟡</span><span>🟢</span><span>🔴</span>
        </span>
      </div>\`;
    chatMessages.appendChild(t);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    typingSound?.play?.().catch(() => {});

    try {
      const res = await fetch("https://flask-agent-proxy-160866660933.europe-west1.run.app/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: txt, session_id })
      });
      const data = await res.json();

      typingSound?.pause?.(); typingSound.currentTime = 0;

      t.remove();
      appendMessage(data.reply || "Λάθος απάντηση", "bot");
      renderBotResponse(data);
    } catch (e) {
      typingSound?.pause?.(); typingSound.currentTime = 0;

      t.remove();
      appendMessage("❌ Σφάλμα — δοκίμασε ξανά", "bot");
    }
  }

  // 10) clearChat
  function clearChat() {
    chatMessages.innerHTML = "";
    localStorage.removeItem("chat_session_id");
    session_id = \`sess-\${Date.now()}\`;
    localStorage.setItem("chat_session_id", session_id);
    appendMessage("🧹 Συνομιλία μηδενίστηκε.", "bot");
  }

  // 11) toggleChat
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

  document.addEventListener("click", () => {/* no-op for focus */});

  // 12) Listeners
  toggleBtn.addEventListener("click", () => { toggleChat(); setTimeout(() => toggleBtn.blur(), 1); });
  closeBtn.addEventListener("click", toggleChat);
  clearBtn.addEventListener("click", clearChat);
  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keydown", e => { if (e.key === "Enter") sendMessage(); });
  
  // Export
  window.sendMessage = sendMessage;
  window.clearChat = clearChat;
});









