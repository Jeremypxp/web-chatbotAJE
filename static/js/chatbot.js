// static/js/chatbot.js
// El prompt del sistema y el contexto ahora viven en el backend
// (chatbot/prompts.js + chatbot/contexto.js). El cliente solo envía
// el historial de mensajes al endpoint /chat.

(function () {
  function getTime() {
    return new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
  }

  function createChatWidget(root) {
    const messagesEl = root.querySelector('.cw-messages');
    const chipsEl = root.querySelector('.cw-chips');
    const errEl = root.querySelector('.cw-err');
    const inputEl = root.querySelector('.cw-input');
    const sendBtn = root.querySelector('.cw-send');
    const resetBtn = root.querySelector('.cw-reset');

    let history = [];

    function addBotMsg(html) {
      const el = document.createElement('div');
      el.className = 'msg bot';
      el.innerHTML = `<div class="bubble">${html}</div><div class="msg-time">${getTime()}</div>`;
      messagesEl.appendChild(el);
      scrollBottom();
    }

    function addUserMsg(text) {
      const el = document.createElement('div');
      el.className = 'msg user';
      el.innerHTML = `<div class="bubble">${text.replace(/</g, '&lt;')}</div><div class="msg-time">${getTime()}</div>`;
      messagesEl.appendChild(el);
      scrollBottom();
    }

    function showTyping() {
      const el = document.createElement('div');
      el.className = 'msg bot typing';
      el.dataset.typing = '1';
      el.innerHTML = '<div class="bubble"><div class="dt"></div><div class="dt"></div><div class="dt"></div></div>';
      messagesEl.appendChild(el);
      scrollBottom();
    }

    function removeTyping() {
      const t = messagesEl.querySelector('[data-typing="1"]');
      if (t) t.remove();
    }

    function scrollBottom() {
      messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function showErr(msg) {
      errEl.textContent = msg;
      errEl.style.display = 'block';
      setTimeout(() => { errEl.style.display = 'none'; }, 6000);
    }

    function resetChat() {
      history = [];
      messagesEl.innerHTML = '';
      if (chipsEl) chipsEl.style.display = 'flex';
      errEl.style.display = 'none';
      addBotMsg('¡Hola de nuevo! 👋 ¿En qué te puedo ayudar?');
    }

    async function handleSend(presetText) {
      const value = (presetText !== undefined ? presetText : inputEl.value).trim();
      if (!value || sendBtn.disabled) return;
      if (presetText === undefined) inputEl.value = '';

      sendBtn.disabled = true;
      if (chipsEl) chipsEl.style.display = 'none';
      errEl.style.display = 'none';

      addUserMsg(value);
      history.push({ role: 'user', content: value });
      showTyping();

      try {
        const res = await fetch('/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error?.message || `Error ${res.status}`);

        const reply = data.content?.filter(b => b.type === 'text').map(b => b.text).join('') || 'No pude generar respuesta.';
        removeTyping();
        addBotMsg(reply);
        history.push({ role: 'assistant', content: reply });
      } catch (e) {
        removeTyping();
        showErr('⚠️ ' + (e.message || 'No se pudo conectar. ¿Está corriendo server.js?'));
        history.pop();
      }

      sendBtn.disabled = false;
      inputEl.focus();
    }

    sendBtn.addEventListener('click', () => handleSend());
    inputEl.addEventListener('keydown', e => { if (e.key === 'Enter') handleSend(); });
    if (resetBtn) resetBtn.addEventListener('click', resetChat);
    root.querySelectorAll('[data-chip]').forEach(chip => {
      chip.addEventListener('click', () => handleSend(chip.dataset.chip));
    });

    addBotMsg('¡Hola! 👋 Soy el asistente virtual del <strong>Grupo AJE</strong>. Puedo ayudarte con información sobre nuestros productos, distribución, proveedores y más. ¿En qué te puedo ayudar?');

    return { resetChat, handleSend };
  }

  window.AJEChat = { createChatWidget };
})();
