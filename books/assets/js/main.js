/**
 * Biblioteca 15min - Main JavaScript (Refactored)
 * ─────────────────────────────────────────────────────────────────
 * Modular book library system with unified design patterns.
 */

(function () {
  "use strict";

  // STATE
  const STATE = {
    books: [],
    currentFilter: "all",
    searchQuery: "",
    currentTheme: localStorage.getItem("theme") || "dark",
    currentLang: localStorage.getItem("lang") || "pt",
    isLoading: true,
  };

  // DOM
  const DOM = {
    booksGrid: document.getElementById("books-grid"),
    emptyState: document.getElementById("empty-state"),
    searchInput: document.getElementById("global-search"),
    searchResults: document.getElementById("search-results"),
    filterBar: document.getElementById("filter-bar"),
    themeToggle: document.getElementById("theme-toggle"),
    statBooks: document.getElementById("stat-books"),
    statCategories: document.getElementById("stat-categories"),
    toast: document.getElementById("toast"),
  };

  // I18N
  const I18N = {
    pt: {
      filter: { all: "Todos" },
      empty: { noResults: "Nenhum livro encontrado." },
      toast: { themeChanged: "Tema alterado", errorLoading: "Erro ao carregar livros" },
    },
    en: {
      filter: { all: "All" },
      empty: { noResults: "No books found." },
      toast: { themeChanged: "Theme changed", errorLoading: "Error loading books" },
    },
  };

  // UTILITIES
  function t(keyPath) {
    const lang = I18N[STATE.currentLang] || I18N.pt;
    const keys = keyPath.split(".");
    let value = lang;
    for (const key of keys) {
      value = value?.[key];
    }
    return value || keyPath;
  }

  function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  function showToast(message, duration = 3000) {
    if (!DOM.toast) return;
    DOM.toast.textContent = message;
    DOM.toast.classList.add("show");
    setTimeout(() => DOM.toast.classList.remove("show"), duration);
  }

  function debounce(fn, delay) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  }

  // THEME
  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    STATE.currentTheme = theme;
    if (DOM.themeToggle) {
      DOM.themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
      DOM.themeToggle.title = theme === "dark" ? "Modo claro" : "Modo escuro";
    }
    if (window.BooksDesignTokens) {
      window.BooksDesignTokens.applyCSSVariables();
    }
  }

  function toggleTheme() {
    applyTheme(STATE.currentTheme === "dark" ? "light" : "dark");
    showToast(t("toast.themeChanged"));
  }

  // COLORS
  function getCategoryColor(category) {
    return window.BooksDesignTokens
      ? window.BooksDesignTokens.getCategoryColor(category)
      : "#00e5ff";
  }

  function getCategoryColorRgb(category) {
    return window.BooksDesignTokens
      ? window.BooksDesignTokens.getCategoryColorRgb(category)
      : "0,229,255";
  }

  // RENDERING
  function renderStats() {
    const categories = new Set(STATE.books.map((b) => b.categoria)).size;
    if (DOM.statBooks) DOM.statBooks.textContent = STATE.books.length;
    if (DOM.statCategories) DOM.statCategories.textContent = categories;
  }

  function renderFilterChips() {
    if (!DOM.filterBar) return;
    const categories = [...new Set(STATE.books.map((b) => b.categoria))].sort();
    const allChip = `<button type="button" class="filter-chip active" data-filter="all">${t(
      "filter.all"
    )}</button>`;
    const chips = categories
      .map((cat) => `<button type="button" class="filter-chip" data-filter="${cat}">${escapeHtml(cat)}</button>`)
      .join("");
    DOM.filterBar.innerHTML = allChip + chips;

    if (window.BooksUtils?.bindSingleDelegateEvent) {
      window.BooksUtils.bindSingleDelegateEvent(DOM.filterBar, "click", ".filter-chip", (chip) => {
        DOM.filterBar.querySelectorAll(".filter-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        STATE.currentFilter = chip.dataset.filter;
        renderBooks();
      });
    }
  }

  function createBookCard(book) {
    const accent = getCategoryColor(book.categoria);
    const accentRgb = getCategoryColorRgb(book.categoria);
    const tags = book.tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
    const isRead = window.NVAuth?.isAuthenticated && window.NVAuth?.isBookRead(book.id);
    const badge = isRead ? '<div class="book-read-badge">✓ Lido</div>' : "";

    return `
    <article class="book-item ${isRead ? "book-read" : ""}" role="button" data-id="${book.id}" tabindex="0" style="--book-accent: ${accent}; --book-accent-rgb: ${accentRgb};">
      <div class="book-wrapper">${badge}
        <div class="book-cover">
          <div class="book-3d" aria-hidden="true">
            <div class="book-back"></div>
            <div class="book-top-edge"></div>
            <div class="book-spine"><span class="book-spine-label">${escapeHtml(book.titulo)}</span></div>
            <div class="book-front">
              <div class="book-shine"></div>
              <span class="book-cover-category">${escapeHtml(book.categoria)}</span>
              <div class="book-cover-divider"></div>
              <span class="book-cover-icon">📖</span>
              <div class="book-cover-divider"></div>
              <span class="book-cover-title">${escapeHtml(book.titulo)}</span>
              <span class="book-cover-author">${escapeHtml(book.autor)}</span>
              <div class="book-cover-bottom">
                <div class="book-tags-inside">${tags}</div>
                <span class="book-cover-year">${book.ano} · ${book.tempoLeitura} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`;
  }

  function renderLoadingState() {
    if (!DOM.booksGrid) return;
    DOM.booksGrid.classList.remove("hidden");
    DOM.booksGrid.innerHTML = Array.from({ length: 6 }, (_, index) => `
      <div class="book-skeleton-card" aria-hidden="true">
        <div class="book-skeleton-cover"></div>
        <div class="book-skeleton-line short"></div>
        <div class="book-skeleton-line"></div>
        <div class="book-skeleton-line"></div>
      </div>
    `).join("");
    if (DOM.emptyState) DOM.emptyState.classList.add("hidden");
  }

  function renderBooks() {
    if (STATE.isLoading) {
      renderLoadingState();
      return;
    }

    let filtered = STATE.books;

    if (STATE.currentFilter !== "all") {
      filtered = filtered.filter((b) => b.categoria === STATE.currentFilter);
    }

    if (STATE.searchQuery) {
      const q = STATE.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          b.titulo.toLowerCase().includes(q) ||
          b.autor.toLowerCase().includes(q) ||
          b.categoria.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      if (DOM.booksGrid) DOM.booksGrid.innerHTML = "";
      if (DOM.booksGrid) DOM.booksGrid.classList.add("hidden");
      if (DOM.emptyState) {
        const hasActiveFilter = STATE.currentFilter !== "all" || STATE.searchQuery;
        DOM.emptyState.innerHTML = window.BooksUtils?.createCatalogStateMarkup({
          type: "empty",
          title: hasActiveFilter ? "Nenhum livro combina com seus filtros" : "A biblioteca ainda está sendo organizada",
          message: hasActiveFilter
            ? "Tente limpar os filtros ou buscar por outro termo para encontrar mais resumos."
            : "Estamos adicionando novos resumos com mais frequência. Volte em breve para descobrir novos livros.",
          actionLabel: hasActiveFilter ? "Mostrar todos os livros" : "",
        });
        DOM.emptyState.classList.remove("hidden");
        const actionButton = DOM.emptyState.querySelector(".state-action");
        if (actionButton) {
          actionButton.addEventListener("click", () => {
            STATE.currentFilter = "all";
            STATE.searchQuery = "";
            if (DOM.searchInput) DOM.searchInput.value = "";
            renderFilterChips();
            renderBooks();
          });
        }
      }
      return;
    }

    if (DOM.emptyState) DOM.emptyState.classList.add("hidden");
    if (DOM.booksGrid) DOM.booksGrid.classList.remove("hidden");
    if (DOM.booksGrid) DOM.booksGrid.innerHTML = filtered.map(createBookCard).join("");

    if (DOM.booksGrid) {
      DOM.booksGrid.querySelectorAll(".book-item").forEach((item) => {
        const handleClick = () => {
          window.location.href = `livro.html?id=${encodeURIComponent(item.dataset.id)}`;
        };
        item.addEventListener("click", handleClick);
        item.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        });
      });
    }
  }

  function renderSearchResults() {
    if (!DOM.searchResults) return;

    if (!STATE.searchQuery) {
      DOM.searchResults.classList.add("hidden");
      return;
    }

    const q = STATE.searchQuery.toLowerCase();
    const results = STATE.books
      .filter(
        (b) =>
          b.titulo.toLowerCase().includes(q) ||
          b.autor.toLowerCase().includes(q) ||
          b.categoria.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      )
      .slice(0, 8);

    if (results.length === 0) {
      DOM.searchResults.innerHTML = `<div class="search-empty">${t("empty.noResults")}</div>`;
      DOM.searchResults.classList.remove("hidden");
      return;
    }

    DOM.searchResults.innerHTML = results
      .map(
        (book) =>
          `<button type="button" class="search-result-item" data-id="${book.id}"><span class="search-result-title">${escapeHtml(
            book.titulo
          )}</span><span class="search-result-meta">${escapeHtml(book.autor)} · ${escapeHtml(
            book.categoria
          )} · ${book.tempoLeitura} min</span></button>`
      )
      .join("");

    DOM.searchResults.classList.remove("hidden");

    DOM.searchResults.querySelectorAll(".search-result-item").forEach((item) => {
      item.addEventListener("click", () => {
        window.location.href = `livro.html?id=${encodeURIComponent(item.dataset.id)}`;
        if (DOM.searchResults) DOM.searchResults.classList.add("hidden");
        if (DOM.searchInput) DOM.searchInput.value = "";
        STATE.searchQuery = "";
      });
    });
  }

  // EVENTS
  function setupSearchHandlers() {
    if (!DOM.searchInput) return;

    const debouncedSearch = debounce(() => {
      renderSearchResults();
      renderBooks();
    }, 150);

    DOM.searchInput.addEventListener("input", (e) => {
      STATE.searchQuery = e.target.value.trim();
      debouncedSearch();
    });

    DOM.searchInput.addEventListener("focus", () => {
      if (STATE.searchQuery) renderSearchResults();
    });

    DOM.searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (DOM.searchResults) DOM.searchResults.classList.add("hidden");
        DOM.searchInput.blur();
      }
    });

    document.addEventListener("keydown", (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        DOM.searchInput.focus();
      }
    });
  }

  function setupClickOutsideHandler() {
    document.addEventListener("click", (e) => {
      if (!e.target.closest(".search-bar-wrap") && DOM.searchResults) {
        DOM.searchResults.classList.add("hidden");
      }
    });
  }

  function setupThemeToggle() {
    if (DOM.themeToggle) {
      DOM.themeToggle.addEventListener("click", toggleTheme);
    }
  }

  // LOADING
  async function loadBooks() {
    STATE.isLoading = true;
    renderBooks();

    try {
      const response = await fetch("./data/livros.json");
      if (!response.ok) throw new Error("Failed to load books");
      const rawBooks = await response.json();
      const normalizedBooks = window.BooksData?.normalizeBooks ? window.BooksData.normalizeBooks(rawBooks) : rawBooks;
      STATE.books = normalizedBooks;
      STATE.isLoading = false;
      renderStats();
      renderFilterChips();
      renderBooks();
    } catch (error) {
      console.error("Error loading books:", error);
      STATE.isLoading = false;
      showToast(t("toast.errorLoading"));
      if (DOM.booksGrid) {
        DOM.booksGrid.classList.remove("hidden");
        DOM.booksGrid.innerHTML = window.BooksUtils?.createCatalogStateMarkup({
          type: "empty",
          title: "Não foi possível carregar a biblioteca",
          message: "Tente recarregar a página para buscar os resumos novamente.",
        });
      }
      if (DOM.emptyState) {
        DOM.emptyState.classList.add("hidden");
      }
    }
  }

  // INIT
  function init() {
    applyTheme(STATE.currentTheme);
    setupSearchHandlers();
    setupClickOutsideHandler();
    setupThemeToggle();
    loadBooks();
  }

  // EXPORTS
  window.BooksApp = { STATE, renderBooks, toggleTheme, showToast };
  window.renderBooks = renderBooks;
  window.updateBookCardReadStatus = function (bookId, marked) {
    const card = document.querySelector(`.book-item[data-id="${bookId}"]`);
    if (!card) return;
    if (marked) {
      card.classList.add("book-read");
      if (!card.querySelector(".book-read-badge")) {
        const badge = document.createElement("div");
        badge.className = "book-read-badge";
        badge.textContent = "✓ Lido";
        card.querySelector(".book-wrapper").prepend(badge);
      }
    } else {
      card.classList.remove("book-read");
      card.querySelector(".book-read-badge")?.remove();
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
