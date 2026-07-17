// Biblioteca 15min - Book Page JavaScript

// State
let currentBook = null;
let currentTheme = localStorage.getItem('theme') || 'dark';
let currentLang = 'pt';

// DOM Elements
const bookContent = document.getElementById('book-content');
const bookTitle = document.getElementById('book-title');
const bookTitleMain = document.getElementById('book-title-main');
const bookAuthor = document.getElementById('book-author');
const bookYear = document.getElementById('book-year');
const bookCategory = document.getElementById('book-category');
const bookTime = document.getElementById('book-time');
const breadcrumbTitle = document.getElementById('breadcrumb-title');
const themeToggle = document.getElementById('theme-toggle');
const toast = document.getElementById('toast');

// URL parsing
function getBookId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Theme handling
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
  themeToggle.title = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
}

function toggleTheme() {
  applyTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

// Toast
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// Load book data
async function loadBook() {
  const bookId = getBookId();
  if (!bookId) {
    showError('ID do livro não especificado');
    return;
  }

  try {
    // First load the index to get metadata
    const response = await fetch('./data/livros.json');
    if (!response.ok) throw new Error('Failed to load books index');
    const books = await response.json();
    
    const bookMeta = books.find(b => b.id === bookId);
    if (!bookMeta) {
      showError('Livro não encontrado');
      return;
    }

    // Load the markdown content
    const mdResponse = await fetch(bookMeta.arquivo);
    if (!mdResponse.ok) throw new Error('Failed to load book content');
    const markdown = await mdResponse.text();

    // Render
    renderBook(bookMeta, markdown);
  } catch (error) {
    console.error('Error loading book:', error);
    showError('Erro ao carregar o livro');
  }
}

function renderBook(meta, markdown) {
  currentBook = meta;

  // Update meta tags
  document.title = `${meta.titulo} — Biblioteca 15min`;
  document.querySelector('meta[name="description"]').content = `Resumo de ${meta.titulo} por ${meta.autor} - Biblioteca 15min`;

  // Update breadcrumb
  document.getElementById('breadcrumb-title').textContent = meta.titulo;

  // Update header info
  document.getElementById('lesson-title').textContent = meta.titulo;
  document.getElementById('lesson-meta').innerHTML = `<span>⏱ ${meta.tempoLeitura} min</span> · <span>${meta.categoria}</span> · <span>${meta.ano}</span>`;
  
  // Update sidebar
  document.getElementById('sidebar-track').textContent = meta.categoria;
  document.getElementById('sidebar-course').textContent = meta.titulo;
  document.getElementById('sidebar-lessons').innerHTML = `<li><strong>${meta.autor}</strong></li>`;

  // Render markdown content
  const html = markdown.replace(/<h1[^>]*>/g, '<h2>').replace(/<\/h1>/g, '</h2>');
  document.getElementById('book-content').innerHTML = html;

  // Add copy buttons to code blocks
  document.querySelectorAll('pre code').forEach(block => {
    const pre = block.parentElement;
    if (!pre.classList.contains('code-block')) {
      pre.classList.add('code-block');
      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.textContent = '📋';
      btn.style.cssText = 'position:absolute;top:0.5rem;right:0.5rem;padding:0.4rem 0.6rem;background:var(--bg-elevated);border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:0.9rem;';
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(block.textContent).then(() => {
          showToast('Copiado!');
        });
      });
      pre.appendChild(btn);
    }
  });
}

function showError(message) {
  document.getElementById('book-content').innerHTML = `
    <div class="empty-state">
      <h2>Erro</h2>
      <p>${message}</p>
      <a href="index.html" class="btn btn-secondary" style="margin-top:1rem;">Voltar à Biblioteca</a>
    </div>
  `;
}

function getTierClass(category) {
  const tierMap = {
    'Psicologia':    'tier-beginner',
    'Produtividade': 'tier-beginner',
    'Ciência':       'tier-beginner',
    'Economia':      'tier-beginner',
    'Biografia':     'tier-beginner',
    'Negócios':      'tier-intermediate',
    'Finanças':      'tier-intermediate',
    'Tecnologia':    'tier-intermediate',
    'Filosofia':     'tier-intermediate',
    'História':      'tier-intermediate',
    'Autoajuda':     'tier-intermediate',
    'Marketing':     'tier-intermediate',
    'Liderança':     'tier-intermediate',
  };
  return tierMap[category] || 'tier-beginner';
}

// Toast
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  document.getElementById('theme-toggle').textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  document.getElementById('theme-toggle').title = savedTheme === 'dark' ? 'Modo claro' : 'Modo escuro';

  document.getElementById('theme-toggle').addEventListener('click', () => {
    const newTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    document.getElementById('theme-toggle').textContent = newTheme === 'dark' ? '☀️' : '🌙';
    document.getElementById('theme-toggle').title = newTheme === 'dark' ? 'Modo claro' : 'Modo escuro';
  });

  loadBook();
});