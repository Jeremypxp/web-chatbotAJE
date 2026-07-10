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

/* ── BÚSQUEDA DEL SITIO (nav) ── */
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('site-search');
  if (!searchInput) return;

  // Mapa de términos → destino. Los productos se resuelven aparte, buscando en .product-name
  const sectionMap = [
    { keywords: ['distribuidor', 'distribucion', 'distribución', 'delivery'], target: '#chatbot', chip: '¿Cómo puedo ser distribuidor?' },
    { keywords: ['proveedor', 'proveedores'], target: '#chatbot', chip: '¿Cómo ser proveedor de AJE?' },
    { keywords: ['contacto', 'contactar', 'telefono', 'teléfono'], target: '#chatbot', chip: '¿Cómo contacto a AJE?' },
    { keywords: ['pais', 'país', 'paises', 'países', 'presencia', 'global'], target: '#presencia' },
    { keywords: ['mision', 'misión', 'vision', 'visión', 'proposito', 'propósito'], target: '#mision' },
    { keywords: ['historia', 'nosotros', 'fundacion', 'fundación', 'ayacucho'], target: '#nosotros' },
  ];

  function flashHighlight(el) {
    el.classList.add('search-highlight');
    setTimeout(() => el.classList.remove('search-highlight'), 1800);
  }

  function showNoResults() {
    let toast = document.getElementById('search-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'search-toast';
      toast.className = 'search-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = 'No se encontraron resultados para tu búsqueda.';
    toast.classList.add('visible');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('visible'), 2500);
  }

  function runSearch(query) {
    const q = query.trim().toLowerCase();
    if (!q) return;

    // 1) Buscar coincidencia entre las tarjetas de producto
    const cards = document.querySelectorAll('.product-card .product-name');
    for (const nameEl of cards) {
      if (nameEl.textContent.toLowerCase().includes(q)) {
        const card = nameEl.closest('.product-card');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        flashHighlight(card);
        return;
      }
    }

    // 2) Buscar coincidencia entre secciones conocidas
    for (const entry of sectionMap) {
      if (entry.keywords.some(k => q.includes(k))) {
        const el = document.querySelector(entry.target);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          if (entry.chip) {
            // Precompleta el chat con la pregunta relacionada, si el widget existe
            setTimeout(() => {
              const chip = [...document.querySelectorAll(`[data-chip="${entry.chip}"]`)][0];
              if (chip) chip.click();
            }, 500);
          }
        }
        return;
      }
    }

    // 3) Nada encontrado
    showNoResults();
  }

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      runSearch(searchInput.value);
    }
  });
});