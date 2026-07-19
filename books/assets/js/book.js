// Biblioteca 15min - Book Page JavaScript

// State
const STATE = {
  currentBook: null,
};

const DOM = {
  get bookContent() {
    return document.getElementById('book-content');
  },
  get lessonTitle() {
    return document.getElementById('lesson-title');
  },
  get lessonMeta() {
    return document.getElementById('lesson-meta');
  },
  get breadcrumbTitle() {
    return document.getElementById('breadcrumb-title');
  },
  get sidebarTrack() {
    return document.getElementById('sidebar-track');
  },
  get sidebarCourse() {
    return document.getElementById('sidebar-course');
  },
  get sidebarLessons() {
    return document.getElementById('sidebar-lessons');
  },
  get themeToggle() {
    return document.getElementById('theme-toggle');
  },
  get toast() {
    return document.getElementById('toast');
  },
  get markAsReadBtn() {
    return document.getElementById('mark-as-read-btn');
  },
  get bookmarkBtn() {
    return document.getElementById('bookmark-btn');
  },
};

/* global marked */

// URL parsing
function getBookId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Toast
function showToast(message, duration = 3000) {
  window.BooksUtils?.showToast(message, duration);
}

const BOOKMARK_STORAGE_KEY = 'nv_saved_books';

function getBookmarkStorageKey() {
  if (window.NVAuth?.isAuthenticated && window.NVAuth?.user?.id) {
    return `nv_${window.NVAuth.user.id}_saved_books`;
  }
  return BOOKMARK_STORAGE_KEY;
}

function getSavedBooks() {
  try {
    const storage = localStorage.getItem(getBookmarkStorageKey());
    return storage ? JSON.parse(storage) : [];
  } catch (error) {
    console.warn('Failed to parse saved books:', error);
    return [];
  }
}

function setSavedBooks(bookmarks) {
  try {
    const uniqueBookmarks = Array.from(new Set(bookmarks));
    localStorage.setItem(getBookmarkStorageKey(), JSON.stringify(uniqueBookmarks));
  } catch (error) {
    console.error('Failed to save bookmarks:', error);
  }
}

function isBookBookmarked(bookId) {
  if (!bookId) return false;
  return getSavedBooks().includes(bookId);
}

function updateBookmarkButton(bookId) {
  const btn = DOM.bookmarkBtn;
  if (!btn || !bookId) return;

  const bookmarked = isBookBookmarked(bookId);
  btn.classList.toggle('bookmarked', bookmarked);
  btn.setAttribute('aria-pressed', bookmarked ? 'true' : 'false');
  btn.setAttribute('title', bookmarked ? 'Remover dos favoritos' : 'Salvar nos favoritos');
  btn.setAttribute('aria-label', bookmarked ? 'Remover dos favoritos' : 'Salvar nos favoritos');
}

function toggleBookmark(bookId) {
  if (!bookId) return;

  const bookmarks = getSavedBooks();
  const currentIndex = bookmarks.indexOf(bookId);
  let message = 'Livro salvo nos favoritos';

  if (currentIndex >= 0) {
    bookmarks.splice(currentIndex, 1);
    message = 'Removido dos favoritos';
  } else {
    bookmarks.push(bookId);
  }

  setSavedBooks(bookmarks);
  updateBookmarkButton(bookId);
  showToast(message);
}

function setupBookmarkButton(bookId) {
  const btn = DOM.bookmarkBtn;
  if (!btn) return;

  btn.type = 'button';
  updateBookmarkButton(bookId);

  btn.addEventListener('click', () => toggleBookmark(bookId));

  document.addEventListener('nvauth:login', () => updateBookmarkButton(bookId));
  document.addEventListener('nvauth:logout', () => updateBookmarkButton(bookId));
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
  STATE.currentBook = window.BooksData?.normalizeBook ? window.BooksData.normalizeBook(meta) : meta;

  // Calculate reading time based on word count
  const wordCount = markdown.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(10, Math.ceil(wordCount / 200));
  
  // Update meta tags
  document.title = `${meta.titulo} — Biblioteca 15min`;
  document.querySelector('meta[name="description"]').content = `Resumo de ${meta.titulo} por ${meta.autor} - Biblioteca 15min`;

  // Update breadcrumb
  DOM.breadcrumbTitle.textContent = meta.titulo;

  // Update header info with calculated reading time
  DOM.lessonTitle.textContent = meta.titulo;
  DOM.lessonMeta.innerHTML = `
    <div class="book-author-info">por ${meta.autor}</div>
    <div class="lesson-meta-row">
      <span>${window.NVIcons ? window.NVIcons.get('clock','','14') + ' ' : ''}${readingTime} min de leitura</span> · <span>${meta.categoria}</span> · <span>${meta.ano}</span>
    </div>
  `;
  
  // Update sidebar
  DOM.sidebarTrack.textContent = meta.categoria;
  DOM.sidebarCourse.textContent = meta.titulo;
  DOM.sidebarLessons.innerHTML = `<li><strong>${meta.autor}</strong></li>`;

  // Render markdown content
  if (typeof marked === 'undefined') {
    showError('O renderizador de markdown não está disponível.');
    return;
  }

  const html = marked.parse(markdown);
  DOM.bookContent.innerHTML = html;

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

  // Setup action buttons
  setupBookmarkButton(meta.id);
  setupMarkAsReadButton(meta.id);
}

function generateTableOfContents() {
  const contentEl = DOM.bookContent;
  if (!contentEl) return;
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
  const contentEl = DOM.bookContent;
  if (!contentEl) return;
  const headings = contentEl.querySelectorAll('h2, h3');
  
  if (headings.length === 0) return;

  // Build sidebar TOC
  let sidebarHTML = '<li><strong>Seções:</strong></li>';
  headings.forEach((heading) => {
    const level = heading.tagName === 'H2' ? 2 : 3;
    const indent = level === 2 ? '' : 'style="margin-left:1rem; font-size:0.9rem;"';
    const className = level === 2 ? 'sidebar-section-h2' : 'sidebar-section-h3';
    sidebarHTML += `<li ${indent} class="${className}"><a href="#${heading.id}">${heading.textContent}</a></li>`;
  });

  // Update sidebar
  const sidebarLessons = DOM.sidebarLessons;
  if (!sidebarLessons) return;
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
  const contentEl = DOM.bookContent;
  if (!contentEl) return;
  contentEl.innerHTML = `
    <div class="empty-state">
      <h2>Erro</h2>
      <p>${message}</p>
      <a href="index.html" class="btn btn-secondary" style="margin-top:1rem;">Voltar à Biblioteca</a>
    </div>
  `;
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
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
    btn.setAttribute('aria-pressed', 'false');
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getBookId,
    getSavedBooks,
    setSavedBooks,
    isBookBookmarked,
    toggleBookmark,
    updateBookmarkButton,
    getBookmarkStorageKey,
  };
}

/**
 * Update button visual state based on read status
 */
function updateMarkAsReadButton(bookId) {
  const btn = document.getElementById('mark-as-read-btn');
  if (!btn) return;

  const isRead = window.NVAuth && window.NVAuth.isBookRead(bookId);
  btn.classList.toggle('marked', Boolean(isRead));
  btn.setAttribute('aria-pressed', isRead ? 'true' : 'false');
  btn.querySelector('.mark-text').textContent = isRead ? 'Lido' : 'Marcar como lido';
}