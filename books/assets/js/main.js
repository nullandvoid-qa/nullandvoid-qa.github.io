// Biblioteca 15min - Main JavaScript

// State
let books = [];
let currentFilter = 'all';
let searchQuery = '';
let currentTheme = localStorage.getItem('theme') || 'dark';

// DOM Elements
const booksGrid = document.getElementById('books-grid');
const emptyState = document.getElementById('empty-state');
const searchInput = document.getElementById('global-search');
const searchResults = document.getElementById('search-results');
const filterBar = document.getElementById('filter-bar');
const themeToggle = document.getElementById('theme-toggle');
const statBooks = document.getElementById('stat-books');
const statCategories = document.getElementById('stat-categories');
const toast = document.getElementById('toast');

// i18n strings
const i18n = {
  pt: {
    filter: { all: 'Todos' },
    section: {
      booksTitle: 'Nossos Resumos',
      booksSub: 'Selecione um livro para começar a ler em 15 minutos'
    },
    empty: { noResults: 'Nenhum livro encontrado com esses filtros.' },
    footer: {
      title: 'Biblioteca 15min',
      disclaimer: 'Estes são resumos interpretativos e não substituem a leitura da obra original. Todos os direitos pertencem aos respectivos autores e editoras.',
      about: 'Sobre',
      github: 'GitHub'
    },
    hero: {
      badge: '100% Gratuito · Leia em 15 min',
      title: 'Biblioteca de Resumos de 15 Minutos',
      subtitle: 'Resumos de livros de não-ficção para ler em 15 minutos, mantendo a essência das ideias principais. Sem fluff, sem enrolação — só o que importa.',
      statBooks: 'Livros',
      statCategories: 'Categorias',
      statTime: 'min por livro',
      ctaExplore: 'Explorar Livros →'
    },
    filter: { all: 'Todos' }
  },
  en: {
    filter: { all: 'All' },
    section: {
      booksTitle: 'Our Summaries',
      booksSub: 'Select a book to start reading in 15 minutes'
    },
    empty: { noResults: 'No books found with these filters.' },
    footer: {
      title: 'Biblioteca 15min',
      disclaimer: 'These are interpretive summaries and do not substitute reading the original work. All rights belong to their respective authors and publishers.',
      about: 'About',
      github: 'GitHub'
    },
    hero: {
      badge: '100% Free · Read in 15 min',
      title: '15-Minute Book Summaries Library',
      subtitle: 'Non-fiction book summaries to read in 15 minutes, keeping the essence of the main ideas. No fluff, no filler — just what matters.',
      statBooks: 'Books',
      statCategories: 'Categories',
      statTime: 'min per book',
      ctaExplore: 'Explore Books →'
    },
    filter: { all: 'All' }
  }
};

// Current language
let currentLang = 'pt';

// Utility functions
function showToast(message, duration = 3000) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  currentTheme = theme;
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.title = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// Render functions
function renderStats() {
  const categories = new Set(books.map(b => b.categoria)).size;
  statBooks.textContent = books.length;
  statCategories.textContent = categories;
}

function getCategoryFilterChips() {
  const categories = [...new Set(books.map(b => b.categoria))].sort();
  const allChip = `<button type="button" class="filter-chip active" data-filter="all">${i18n[currentLang].filter.all}</button>`;
  const categoryChips = categories.map(cat =>
    `<button type="button" class="filter-chip" data-filter="${cat}">${cat}</button>`
  ).join('');
  filterBar.innerHTML = allChip + categoryChips;

  // Add click listeners
  filterBar.querySelectorAll('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      filterBar.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      currentFilter = chip.dataset.filter;
      renderBooks();
    });
  });
}

function createBookCard(book) {
  const color = getCategoryColor(book.categoria);
  const coverEmoji = book.capa ? '' : getCategoryEmoji(book.categoria);

  return `
    <article class="book-card" role="listitem" data-id="${book.id}" style="--book-color: ${color};">
      <div class="book-cover" style="background: ${getCategoryGradient(book.categoria)};">
        ${book.capa ? `<img src="${book.capa}" alt="${book.titulo}" loading="lazy" />` : `<span>${coverEmoji}</span>`}
      </div>
      <h3>${escapeHtml(book.titulo)}</h3>
      <p class="book-author">${escapeHtml(book.autor)}</p>
      <div class="book-meta">
        <span>${book.ano}</span>
        <span>·</span>
        <span>${book.tempoLeitura} min</span>
      </div>
      <div class="book-tags">
        ${book.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
    </article>
  `;
}

function renderBooks() {
  let filtered = books;

  // Apply category filter
  if (currentFilter !== 'all') {
    filtered = filtered.filter(b => b.categoria === currentFilter);
  }

  // Apply search filter
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(b =>
      b.titulo.toLowerCase().includes(q) ||
      b.autor.toLowerCase().includes(q) ||
      b.categoria.toLowerCase().includes(q) ||
      b.tags.some(t => t.toLowerCase().includes(q))
    );
  }

  if (filtered.length === 0) {
    booksGrid.innerHTML = '';
    booksGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  emptyState.classList.add('hidden');
  booksGrid.classList.remove('hidden');
  booksGrid.innerHTML = filtered.map(createBookCard).join('');

  // Add click listeners
  booksGrid.querySelectorAll('.book-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      window.location.href = `livro.html?id=${encodeURIComponent(id)}`;
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Ler resumo de ${card.querySelector('h3').textContent}`);
  });
}

function renderSearchResults() {
  if (!searchQuery) {
    searchResults.classList.add('hidden');
    return;
  }

  const q = searchQuery.toLowerCase();
  const results = books.filter(b =>
    b.titulo.toLowerCase().includes(q) ||
    b.autor.toLowerCase().includes(q) ||
    b.categoria.toLowerCase().includes(q) ||
    b.tags.some(t => t.toLowerCase().includes(q))
  ).slice(0, 8);

  if (results.length === 0) {
    searchResults.innerHTML = `<div class="search-empty">Nenhum resultado para "${escapeHtml(searchQuery)}"</div>`;
    searchResults.classList.remove('hidden');
    return;
  }

  searchResults.innerHTML = results.map(book => `
    <button type="button" class="search-result-item" data-id="${book.id}">
      <span class="search-result-title">${escapeHtml(book.titulo)}</span>
      <span class="search-result-meta">${escapeHtml(book.autor)} · ${book.categoria} · ${book.tempoLeitura} min</span>
    </button>
  `).join('');

  searchResults.classList.remove('hidden');

  searchResults.querySelectorAll('.search-result-item').forEach(item => {
    item.addEventListener('click', () => {
      window.location.href = `livro.html?id=${encodeURIComponent(item.dataset.id)}`;
      searchResults.classList.add('hidden');
      searchInput.value = '';
    });
  });
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getCategoryColor(category) {
  const colors = {
    'Psicologia': '#00e5ff',
    'Negócios': '#ff2d78',
    'Produtividade': '#00e5ff',
    'Tecnologia': '#ff2d78',
    'Filosofia': '#ff2d78',
    'Ciência': '#00e5ff',
    'História': '#ff2d78',
    'Biografia': '#00e5ff',
    'Autoajuda': '#ff2d78',
    'Economia': '#00e5ff',
    'Marketing': '#ff2d78',
    'Liderança': '#00e5ff'
  };
  return colors[category] || '#00e5ff';
}

function getCategoryEmoji(category) {
  const emojis = {
    'Psicologia': '🧠',
    'Negócios': '💼',
    'Produtividade': '⚡',
    'Tecnologia': '💻',
    'Filosofia': '📜',
    'Ciência': '🔬',
    'História': '📜',
    'Biografia': '👤',
    'Autoajuda': '🌱',
    'Economia': '💰',
    'Marketing': '📈',
    'Liderança': '👑'
  };
  return emojis[category] || '📖';
}

function getCategoryGradient(category) {
  const gradients = {
    'Psicologia': 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,180,255,0.05))',
    'Negócios': 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(224,0,92,0.05))',
    'Produtividade': 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,180,255,0.05))',
    'Tecnologia': 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(224,0,92,0.05))',
    'Filosofia': 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(224,0,92,0.05))',
    'Ciência': 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,180,255,0.05))',
    'História': 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(224,0,92,0.05))',
    'Biografia': 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,180,255,0.05))',
    'Autoajuda': 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(224,0,92,0.05))',
    'Economia': 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,180,255,0.05))',
    'Marketing': 'linear-gradient(135deg, rgba(255,45,120,0.15), rgba(224,0,92,0.05))',
    'Liderança': 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,180,255,0.05))'
  };
  return gradients[category] || 'linear-gradient(135deg, rgba(0,229,255,0.15), rgba(0,180,255,0.05))';
}

// Search handling
let searchDebounceTimer = null;

searchInput.addEventListener('input', (e) => {
  clearTimeout(searchDebounceTimer);
  searchQuery = e.target.value.trim();
  searchDebounceTimer = setTimeout(() => {
    renderSearchResults();
    renderBooks();
  }, 150);
});

searchInput.addEventListener('focus', () => {
  if (searchQuery) renderSearchResults();
});

document.addEventListener('click', (e) => {
  if (!e.target.closest('.search-bar-wrap')) {
    searchResults.classList.add('hidden');
  }
});

searchInput.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    searchResults.classList.add('hidden');
    searchInput.blur();
  }
});

// Theme toggle
themeToggle.addEventListener('click', toggleTheme);

// Load books data
async function loadBooks() {
  try {
    const response = await fetch('data/livros.json');
    if (!response.ok) throw new Error('Failed to load books');
    books = await response.json();
    renderStats();
    getCategoryFilterChips();
    renderBooks();
  } catch (error) {
    console.error('Error loading books:', error);
    showToast('Erro ao carregar livros');
    booksGrid.innerHTML = '<div class="empty-state"><p>Erro ao carregar livros. Verifique o console.</p></div>';
  }
}

// Initialize
function init() {
  applyTheme(currentTheme);
  loadBooks();
}

// Start
init();