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
  themeToggle.textContent = theme === 'dark' ? 'Modo claro' : 'Modo escuro';
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

  // Calculate reading time based on word count
  const wordCount = markdown.split(/\s+/).length;
  const readingTime = Math.max(10, Math.ceil(wordCount / 200)); // ~200 words per minute
  
  // Update meta tags
  document.title = `${meta.titulo} — Biblioteca 15min`;
  document.querySelector('meta[name="description"]').content = `Resumo de ${meta.titulo} por ${meta.autor} - Biblioteca 15min`;

  // Update breadcrumb
  document.getElementById('breadcrumb-title').textContent = meta.titulo;

  // Update header info with calculated reading time
  document.getElementById('lesson-title').textContent = meta.titulo;
  document.getElementById('lesson-meta').innerHTML = `
    <div class="book-author-info">por ${meta.autor}</div>
    <div class="lesson-meta-row">
      <span>${window.NVIcons ? window.NVIcons.get('clock','','14') + ' ' : ''}${readingTime} min de leitura</span> · <span>${meta.categoria}</span> · <span>${meta.ano}</span>
    </div>
  `;
  
  // Update sidebar
  document.getElementById('sidebar-track').textContent = meta.categoria;
  document.getElementById('sidebar-course').textContent = meta.titulo;
  document.getElementById('sidebar-lessons').innerHTML = `<li><strong>${meta.autor}</strong></li>`;

  // Render markdown content
  const html = marked.parse(markdown);
  document.getElementById('book-content').innerHTML = html;

  // Generate Table of Contents from H2/H3 headings (both in content AND sidebar)
  generateTableOfContents();

  // Populate sidebar with TOC
  populateSidebarTOC();

  // Add copy buttons to code blocks
  document.querySelectorAll('pre code').forEach(block => {
    const pre = block.parentElement;
    if (!pre.classList.contains('code-block')) {
      pre.classList.add('code-block');
      const btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.type = 'button';
      btn.innerHTML = window.NVIcons ? window.NVIcons.get('copy','','14') : '';
      btn.setAttribute('aria-label', 'Copiar código');
      btn.style.cssText = 'position:absolute;top:0.5rem;right:0.5rem;padding:0.4rem 0.6rem;background:var(--bg-elevated);border:1px solid var(--border);border-radius:6px;cursor:pointer;font-size:0.9rem;';
      btn.addEventListener('click', () => {
        navigator.clipboard.writeText(block.textContent).then(() => {
          showToast('Copiado!');
        });
      });
      pre.appendChild(btn);
    }
  });

  // Setup mark-as-read button
  setupMarkAsReadButton(meta.id);
}

function generateTableOfContents() {
  const contentEl = document.getElementById('book-content');
  const headings = contentEl.querySelectorAll('h2, h3');
  
  if (headings.length === 0) return;

  // Add IDs to headings if they don't have them
  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `section-${index}`;
    }
  });

  // Build TOC
  let tocHTML = '<nav class="book-toc"><h4>Índice</h4><ul>';
  headings.forEach((heading) => {
    const level = heading.tagName === 'H2' ? 2 : 3;
    const indent = level === 2 ? '' : 'style="margin-left:1.2rem;"';
    tocHTML += `<li ${indent}><a href="#${heading.id}">${heading.textContent}</a></li>`;
  });
  tocHTML += '</ul></nav>';

  // Insert at top of content
  contentEl.insertAdjacentHTML('afterbegin', tocHTML);

  // Add click handlers for TOC links
  document.querySelectorAll('.book-toc a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Highlight briefly
        target.classList.add('highlight-section');
        setTimeout(() => target.classList.remove('highlight-section'), 2000);
      }
    });
  });
}

function populateSidebarTOC() {
  const contentEl = document.getElementById('book-content');
  const headings = contentEl.querySelectorAll('h2, h3');
  
  if (headings.length === 0) return;

  // Build sidebar TOC
  let sidebarHTML = '<li><strong>Seções:</strong></li>';
  headings.forEach((heading, index) => {
    const level = heading.tagName === 'H2' ? 2 : 3;
    const indent = level === 2 ? '' : 'style="margin-left:1rem; font-size:0.9rem;"';
    const className = level === 2 ? 'sidebar-section-h2' : 'sidebar-section-h3';
    sidebarHTML += `<li ${indent} class="${className}"><a href="#${heading.id}">${heading.textContent}</a></li>`;
  });

  // Update sidebar
  const sidebarLessons = document.getElementById('sidebar-lessons');
  sidebarLessons.innerHTML = sidebarHTML;

  // Add click handlers
  sidebarLessons.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        target.classList.add('highlight-section');
        setTimeout(() => target.classList.remove('highlight-section'), 2000);
      }
    });
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

  // Add reading progress bar
  addReadingProgress();

  loadBook();
});

function addReadingProgress() {
  const progressBar = document.createElement('div');
  progressBar.className = 'reading-progress';
  document.body.insertBefore(progressBar, document.body.firstChild);

  window.addEventListener('scroll', () => {
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = (window.scrollY / windowHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });
}

/**
 * Setup mark-as-read button functionality
 */
function setupMarkAsReadButton(bookId) {
  const btn = document.getElementById('mark-as-read-btn');
  if (!btn) return;

  // Check if user is authenticated
  if (!window.NVAuth || !window.NVAuth.isAuthenticated) {
    btn.disabled = true;
    btn.title = 'Faça login para marcar livros como lidos';
    btn.style.opacity = '0.5';
    return;
  }

  // Load current read status
  updateMarkAsReadButton(bookId);

  // Add click handler
  btn.addEventListener('click', () => {
    if (!window.NVAuth || !window.NVAuth.isAuthenticated) {
      showToast('Faça login para marcar livros como lidos');
      return;
    }

    const isRead = window.NVAuth.isBookRead(bookId);
    
    if (isRead) {
      // Unmark as read
      if (window.NVAuth.unmarkAsRead(bookId)) {
        updateMarkAsReadButton(bookId);
        showToast('Removido dos livros lidos');
      }
    } else {
      // Mark as read
      if (window.NVAuth.markAsRead(bookId)) {
        updateMarkAsReadButton(bookId);
        showToast('✓ Livro marcado como lido!');
      }
    }
  });

  // Listen for auth changes
  document.addEventListener('nvauth:login', () => {
    btn.disabled = false;
    btn.style.opacity = '1';
    btn.title = 'Marcar este livro como lido';
    updateMarkAsReadButton(bookId);
  });

  document.addEventListener('nvauth:logout', () => {
    btn.disabled = true;
    btn.style.opacity = '0.5';
    btn.title = 'Faça login para marcar livros como lidos';
    btn.classList.remove('marked');
  });
}

/**
 * Update button visual state based on read status
 */
function updateMarkAsReadButton(bookId) {
  const btn = document.getElementById('mark-as-read-btn');
  if (!btn) return;

  if (window.NVAuth && window.NVAuth.isBookRead(bookId)) {
    btn.classList.add('marked');
    btn.querySelector('.mark-text').textContent = 'Lido';
  } else {
    btn.classList.remove('marked');
    btn.querySelector('.mark-text').textContent = 'Marcar como lido';
  }
}