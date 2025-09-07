
(() => {
  // 🔠 Material Icons (fixed href)
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/icon?family=Material+Icons";
  document.head.appendChild(link);

  // 🎨 CSS Styling (fixed wrapping + reset vertical writing)
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
    @keyframes bounce { 0%,100% { transform: scale(1); } 50% { transform: scale(1.15); } }
    @keyframes glow { 0%,100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 0.1; transform: scale(1.4); } }

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
    .chatbox.show { display: flex; }
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
    .message { display: flex; max-width: 85%; gap: 0.5rem; }
    .message.bot { align-self: flex-start; flex-direction: row; }
    .message.user { align-self: flex-end; flex-direction: row-reverse; }

    /* ✅ FIX: reset any vertical writing coming from page CSS */
    .message span {
      display: inline-block;
      padding: 0.75rem 1rem;
      border-radius: 1rem;
      font-size: 0.9rem;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      /* wrapping fixes */
      white-space: normal;             /* instead of pre-wrap */
      word-break: normal;              /* reset */
      overflow-wrap: anywhere;         /* allow breaks only when needed */
      hyphens: auto;                   /* nicer Greek wrapping */
      writing-mode: horizontal-tb;     /* override any vertical-rl */
      text-orientation: mixed;         /* default */
      letter-spacing: normal;
      max-width: 100%;
    }
    .message.bot span {
      background: linear-gradient(135deg, #fef3c7, #fde68a);
      color: #1f2937;
    }
    .message.user span {
      background: linear-gradient(135deg, #fb923c, #f59e0b);
      color: white;
    }
    .message.bot span a {
      color: #1d4ed8;
      text-decoration: underline;
      word-break: break-word; /* for long URLs only */
    }

    .input-area {
      display: flex; gap: 0.5rem; padding: 1rem;
      background: rgba(255,255,255,0.98); backdrop-filter: blur(10px);
    }
    .input-area input {
      flex: 1; border: 1px solid #ccc; padding: 0.75rem 1rem; border-radius: 1rem; font-size: 1rem;
    }
    .input-area button {
      width: 3rem; height: 3rem;
      background: linear-gradient(135deg, #fb923c, #f59e0b);
      border: none; border-radius: 1rem; color: white; font-size: 1.4rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
    }

    .qr-wrap{ margin-top:8px; display:flex; align-items:center; gap:.5rem; }
    .qr-wrap canvas, .qr-wrap img{ width:110px; height:110px; border-radius:12px; box-shadow:0 2px 10px rgba(0,0,0,.12); }
    .qr-label{ font-size:.85rem; color:#111; background:#fff7ed; padding:.35rem .5rem; border-radius:.5rem; }

    @media (max-width: 768px) {
      .chatbox {
        left: 0 !important; top: 0 !important; width: 100vw !important; height: 100svh !important;
        border-radius: 0 !important; max-width: 100vw !important; max-height: 100svh !important;
        z-index: 10000 !important;
      }
    }
  `;
  document.head.appendChild(style);

  // 🧱 Widget DOM
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
      <div><span class="material-icons close-chat-btn" style="cursor:pointer;">close</span></div>
    </div>
    <div class="chat-messages" id="chat-messages"></div>
    <div class="input-area">
      <input type="text" id="user-input" placeholder="Πληκτρολογήστε..." />
      <button id="send-btn" title="Αποστολή"><span class="material-icons">send</span></button>
    </div>
  `;
  wrapper.appendChild(chatbox);
  document.body.appendChild(wrapper);

  const chatMessages = chatbox.querySelector("#chat-messages");
  const userInput = chatbox.querySelector("#user-input");
  const sendBtn = chatbox.querySelector("#send-btn");
  const closeBtn = chatbox.querySelector(".close-chat-btn");

  // 📡 Backend proxy
  const proxyUrl = "https://flask-agent-proxy-160866660933.europe-west1.run.app/api/agent";
  let sessionId = localStorage.getItem("chat_session_id") || `sess-${Date.now()}`;
  localStorage.setItem("chat_session_id", sessionId);

  // ─────────────────────────────────────────────────────────
  // 🔧 Helpers: Markdown→HTML, autolink, sanitizer, QR
  const mdLinksToHtml = (s) =>
    (s || "").replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, txt, url) => {
      const safeUrl = String(url).replace(/"/g, "&quot;");
      const safeTxt = String(txt).replace(/</g, "&lt;").replace(/>/g, "&gt;");
      return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${safeTxt}</a>`;
    });

  const autoLink = (s) =>
    (s || "").replace(/((https?:\/\/)[^\s<]+)/g, (m) => {
      // Απόφυγε διπλή μετατροπή αν ήδη υπάρχουν <a>
      if (/(<a\s[^>]*href=)/i.test(s)) return m;
      const safe = m.replace(/"/g, "&quot;");
      return `<a href="${safe}" target="_blank" rel="noopener noreferrer">${safe}</a>`;
    });

  // κρατάμε \n για παράγραφους αλλά όχι “pre” spacing
  const nl2p = (s) => {
    const parts = String(s || "").split(/\n{2,}/).map(p => p.trim()).filter(Boolean);
    return parts.map(p => `<p>${p.replace(/\n/g, "<br>")}</p>`).join("");
  };

  const sanitize = (html) => {
    const allowTags = new Set(["A","BR","STRONG","EM","B","I","P"]);
    const allowAttrs = { "A": new Set(["href","target","rel"]) };
    const tmp = document.createElement("div");
    tmp.innerHTML = html;

    const walk = (node) => {
      const children = Array.from(node.children);
      for (const el of children) {
        if (!allowTags.has(el.tagName)) {
          const span = document.createElement("span");
          span.textContent = el.textContent;
          el.replaceWith(span);
          continue;
        }
        Array.from(el.attributes).forEach(attr => {
          if (!allowAttrs[el.tagName]?.has(attr.name.toLowerCase())) el.removeAttribute(attr.name);
        });
        if (el.tagName === "A") {
          const href = el.getAttribute("href") || "";
          if (!/^https?:\/\//i.test(href)) el.removeAttribute("href");
          else { el.setAttribute("target","_blank"); el.setAttribute("rel","noopener noreferrer"); }
        }
        walk(el);
      }
    };
    walk(tmp);
    return tmp.innerHTML;
  };

  const renderRich = (text) => {
    const html = sanitize(nl2p(autoLink(mdLinksToHtml(String(text || "")))));
    return html;
  };

  const loadQR = () => new Promise((resolve) => {
    if (window.QRCode) return resolve();
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = resolve;
    document.head.appendChild(s);
  });

  const findSpecialLinks = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    const anchors = Array.from(tmp.querySelectorAll("a[href]"));
    const QR_HOSTS = ["booking.infoxoros.com","grtaxi.eu","taxipatras.com"];
    return anchors
      .map(a => a.getAttribute("href"))
      .filter(href => {
        try { return QR_HOSTS.some(h => new URL(href).host.includes(h)); }
        catch { return false; }
      });
  };

  const renderQRBelow = async (container, urls) => {
    if (!urls || !urls.length) return;
    await loadQR();
    urls.forEach((u) => {
      const wrap = document.createElement("div");
      wrap.className = "qr-wrap";
      const box = document.createElement("div");
      const label = document.createElement("span");
      label.className = "qr-label";
      label.textContent = "Σκάναρε για άμεση πρόσβαση";
      wrap.appendChild(box);
      wrap.appendChild(label);
      container.appendChild(wrap);
      new QRCode(box, { text: u, width: 110, height: 110, correctLevel: QRCode.CorrectLevel.M });
    });
  };

  // ─────────────────────────────────────────────────────────
  // 💬 Render helpers

  const appendMessage = (text, sender) => {
    const message = document.createElement("div");
    message.className = `message ${sender}`;
    const span = document.createElement("span");

    if (sender === "bot") {
      const html = renderRich(text);
      span.innerHTML = html;
      message.appendChild(span);
      chatMessages.appendChild(message);
      // QR μόνο για ειδικά links
      const special = findSpecialLinks(html);
      renderQRBelow(message, special);
    } else {
      span.textContent = text; // user: plain text
      message.appendChild(span);
      chatMessages.appendChild(message);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  const renderBotResponse = (payload) => {
    // Κουμπί για map_url (αν έρθει από backend)
    if (payload.map_url) {
      const mapBtn = document.createElement("div");
      mapBtn.className = "message bot";
      const lang = payload.language_code || "el";
      const label = lang.startsWith("en") ? "📌 View route on map" : "📌 Δες τη διαδρομή στον χάρτη";
      mapBtn.innerHTML = `
        <a href="${payload.map_url}" target="_blank" rel="noopener noreferrer"
          style="display:inline-block;margin-top:8px;padding:10px 16px;
          background:#2547f3;color:white;border-radius:8px;font-weight:bold;
          text-decoration:none;transition:all 0.3s ease-in-out;">
          ${label}
        </a>
      `;
      const a = mapBtn.querySelector("a");
      a.addEventListener("click", e => {
        e.preventDefault();
        window.open(a.href, "_blank", "noopener,noreferrer");
      });
      chatMessages.appendChild(mapBtn);
    }
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  // ─────────────────────────────────────────────────────────
  // 🚀 Send flow

  const sendMessage = async () => {
    const text = userInput.value.trim();
    if (!text) return;
    appendMessage(text, "user");
    userInput.value = "";

    // ➤ Typing Animation Bubble
    const typingMsg = document.createElement("div");
    typingMsg.className = "message bot";
    const typingSpan = document.createElement("span");
    typingMsg.appendChild(typingSpan);
    chatMessages.appendChild(typingMsg);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    let dots = 0;
    const typingInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      typingSpan.textContent = "Ο Mr Booky γράφει" + ".".repeat(dots);
    }, 500);

    try {
      const res = await fetch(proxyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, session_id: sessionId })
      });

      clearInterval(typingInterval);
      typingMsg.remove();

      const data = await res.json();
      const botReply = data.reply || "Δεν υπάρχει απάντηση αυτή τη στιγμή.";
      appendMessage(botReply, "bot");
      renderBotResponse(data);
    } catch (err) {
      clearInterval(typingInterval);
      typingMsg.remove();
      appendMessage("⚠️ Σφάλμα σύνδεσης.", "bot");
    }
  };

  // ─────────────────────────────────────────────────────────
  // 🎛️ UI bindings

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
  userInput.addEventListener("keydown", (e) => { if (e.key === "Enter") sendMessage(); });
})();




