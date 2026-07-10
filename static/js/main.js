// static/js/main.js

/* ── SUBNAV ACTIVE ── */
document.querySelectorAll('.subnav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.subnav-item').forEach(i => i.classList.remove('active'));
    item.classList.add('active');
  });
});

/* ── BOTÓN FLOTANTE DEL CHAT ── */
document.addEventListener('DOMContentLoaded', () => {
  // Widget embebido en la sección "Asistente inteligente"
  const inlineRoot = document.getElementById('chat-inline');
  if (inlineRoot && window.AJEChat) {
    window.AJEChat.createChatWidget(inlineRoot);
  }

  // Widget del panel flotante (se crea recién al abrirlo la primera vez)
  const fabRoot = document.getElementById('chat-fab-widget');
  const fabBtn = document.getElementById('chat-fab-btn');
  const fabPanel = document.getElementById('chat-fab-panel');
  let fabWidget = null;

  function openPanel() {
    fabPanel.classList.add('is-open');
    fabBtn.classList.add('is-open');
    fabBtn.setAttribute('aria-expanded', 'true');
    if (!fabWidget && window.AJEChat) {
      fabWidget = window.AJEChat.createChatWidget(fabRoot);
    }
  }

  function closePanel() {
    fabPanel.classList.remove('is-open');
    fabBtn.classList.remove('is-open');
    fabBtn.setAttribute('aria-expanded', 'false');
  }

  if (fabBtn && fabPanel) {
    fabBtn.addEventListener('click', () => {
      fabPanel.classList.contains('is-open') ? closePanel() : openPanel();
    });

    const closeBtn = fabPanel.querySelector('.cw-close');
    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    // Cierra el panel si se hace clic fuera de él
    document.addEventListener('click', e => {
      const clickedInsidePanel = fabPanel.contains(e.target);
      const clickedFab = fabBtn.contains(e.target);
      if (!clickedInsidePanel && !clickedFab && fabPanel.classList.contains('is-open')) {
        closePanel();
      }
    });

    // Cierra con la tecla Escape
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && fabPanel.classList.contains('is-open')) closePanel();
    });
  }
});

/* ── BÚSQUEDA DEL SITIO (nav, con sugerencias en vivo) ── */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('site-search');
  const dropdown = document.getElementById('search-dropdown');
  if (!searchInput || !dropdown) return;

  const norm = s => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Índice de búsqueda: productos (desde el DOM, así siempre está sincronizado con la web)
  function buildIndex() {
    const items = [];

    document.querySelectorAll('.product-card').forEach(card => {
      const name = card.querySelector('.product-name')?.textContent.trim();
      const cat = card.querySelector('.product-cat')?.textContent.trim();
      const img = card.querySelector('.product-icon')?.getAttribute('src');
      if (!name) return;
      items.push({
        type: 'producto', label: name, sub: cat, img,
        action: () => {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          flashHighlight(card);
        }
      });
    });

    const sections = [
      { label: 'Productos', sub: 'Todas nuestras marcas', icon: '🥤', target: '#productos' },
      { label: 'Distribución', sub: 'Cómo ser distribuidor', icon: '🚚', target: '#chatbot', chip: '¿Cómo puedo ser distribuidor?' },
      { label: 'Proveedores', sub: 'Cómo ser proveedor', icon: '🏭', target: '#chatbot', chip: '¿Cómo ser proveedor de AJE?' },
      { label: 'Contacto', sub: 'Teléfono, correo, WhatsApp', icon: '📞', target: '#chatbot', chip: '¿Cómo contacto a AJE?' },
      { label: 'Presencia global', sub: 'Países y plantas', icon: '🌎', target: '#presencia' },
      { label: 'Misión y visión', sub: 'Nuestro propósito', icon: '🎯', target: '#mision' },
      { label: 'Nuestra historia', sub: 'Desde 1988 en Ayacucho', icon: '📖', target: '#nosotros' },
    ];
    sections.forEach(s => {
      items.push({
        type: 'sección', label: s.label, sub: s.sub, icon: s.icon,
        action: () => {
          const el = document.querySelector(s.target);
          if (!el) return;
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (s.chip) {
            setTimeout(() => {
              const chipEl = document.querySelector(`[data-chip="${s.chip}"]`);
              if (chipEl) chipEl.click();
            }, 500);
          }
        }
      });
    });

    return items;
  }

  function flashHighlight(el) {
    el.classList.add('search-highlight');
    setTimeout(() => el.classList.remove('search-highlight'), 1800);
  }

  function highlightMatch(label, q) {
    const i = norm(label).indexOf(q);
    if (i === -1) return label;
    return label.slice(0, i) + '<mark>' + label.slice(i, i + q.length) + '</mark>' + label.slice(i + q.length);
  }

  const INDEX = buildIndex();
  let activeIndex = -1;
  let currentMatches = [];

  function renderDropdown(matches, q) {
    currentMatches = matches;
    activeIndex = -1;

    if (!matches.length) {
      dropdown.innerHTML = `<div class="sd-empty">No se encontraron resultados para "${q}"</div>`;
      dropdown.classList.add('visible');
      return;
    }

    dropdown.innerHTML = matches.map((item, idx) => `
        <div class="sd-item" data-idx="${idx}">
          <div class="sd-text">
            <div class="sd-title">${highlightMatch(item.label, q)}</div>
            <div class="sd-sub">${item.sub || item.type}</div>
          </div>
        </div>
    `).join('');
    dropdown.classList.add('visible');

    dropdown.querySelectorAll('.sd-item').forEach(el => {
      el.addEventListener('click', () => selectItem(parseInt(el.dataset.idx, 10)));
    });
  }

  function closeDropdown() {
    dropdown.classList.remove('visible');
    dropdown.innerHTML = '';
    currentMatches = [];
    activeIndex = -1;
  }

  function selectItem(idx) {
    const item = currentMatches[idx];
    if (!item) return;
    item.action();
    searchInput.value = '';
    closeDropdown();
    searchInput.blur();
  }

  function updateActive() {
    dropdown.querySelectorAll('.sd-item').forEach((el, i) => {
      el.classList.toggle('active', i === activeIndex);
    });
  }

  searchInput.addEventListener('input', () => {
    const q = norm(searchInput.value.trim());
    if (!q) { closeDropdown(); return; }

    const matches = INDEX.filter(item => norm(item.label).includes(q)).slice(0, 7);
    renderDropdown(matches, q);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (!dropdown.classList.contains('visible')) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, currentMatches.length - 1);
      updateActive();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      updateActive();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      selectItem(activeIndex >= 0 ? activeIndex : 0);
    } else if (e.key === 'Escape') {
      closeDropdown();
      searchInput.blur();
    }
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-search')) closeDropdown();
  });
});