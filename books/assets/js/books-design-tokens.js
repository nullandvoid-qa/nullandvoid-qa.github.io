/**
 * Books Design Tokens System
 * ─────────────────────────────────────────────────────────────────
 * Centralized design system matching homepage (nullandvoid-qa) patterns.
 * Ensures consistency in colors, spacing, typography, and animations.
 */

(function () {
  "use strict";

  // ──────────────────────────────────────────────────────────────
  // COLOR SYSTEM
  // ──────────────────────────────────────────────────────────────

  const COLORS = {
    dark: {
      bg: "#070b18",
      surface: "#111827",
      bgCard: "#111b2f",
      bgElevated: "#131d36",
      border: "#21304d",
      text: "#f8fafc",
      textMuted: "#94a3b8",
      accent: "#60a5fa",
      accentHover: "#38bdf8",
      accentGlow: "rgba(56, 189, 248, 0.14)",
      pink: "#ec4899",
      pinkHover: "#db2777",
      pinkGlow: "rgba(236, 72, 153, 0.16)",
      cyan: "#00e5ff",
      cyanHover: "#00b8d4",
      cyanGlow: "rgba(0, 229, 255, 0.22)",
      freeBadge: "#60a5fa",
    },
    light: {
      bg: "#f2f2f2",
      surface: "#ffffff",
      bgCard: "#ffffff",
      bgElevated: "#e8e8e8",
      border: "#d0d0d0",
      text: "#1a1a1a",
      textMuted: "#666666",
      accent: "#0099bb",
      accentHover: "#007299",
      accentGlow: "rgba(0, 153, 187, 0.2)",
      pink: "#cc005a",
      pinkHover: "#aa0048",
      pinkGlow: "rgba(204, 0, 90, 0.15)",
      cyan: "#0099bb",
      cyanHover: "#007299",
      cyanGlow: "rgba(0, 153, 187, 0.2)",
      freeBadge: "#0099bb",
    },
  };

  // Category-specific color mappings
  const CATEGORY_COLORS = {
    Psicologia: { accent: "#00e5ff", rgb: "0,229,255" },
    Negócios: { accent: "#ff2d78", rgb: "255,45,120" },
    Produtividade: { accent: "#00e5ff", rgb: "0,229,255" },
    Finanças: { accent: "#ff2d78", rgb: "255,45,120" },
    Tecnologia: { accent: "#ff2d78", rgb: "255,45,120" },
    Filosofia: { accent: "#ff2d78", rgb: "255,45,120" },
    Ciência: { accent: "#00e5ff", rgb: "0,229,255" },
    História: { accent: "#ff2d78", rgb: "255,45,120" },
    Biografia: { accent: "#00e5ff", rgb: "0,229,255" },
    Autoajuda: { accent: "#ff2d78", rgb: "255,45,120" },
    Economia: { accent: "#00e5ff", rgb: "0,229,255" },
    Marketing: { accent: "#ff2d78", rgb: "255,45,120" },
    Liderança: { accent: "#00e5ff", rgb: "0,229,255" },
  };

  // ──────────────────────────────────────────────────────────────
  // SPACING SCALE
  // ──────────────────────────────────────────────────────────────

  const SPACING = {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    xxl: "3rem", // 48px
    xxxl: "4rem", // 64px
  };

  // ──────────────────────────────────────────────────────────────
  // TYPOGRAPHY
  // ──────────────────────────────────────────────────────────────

  const TYPOGRAPHY = {
    fontFamily: '"Inter", "Segoe UI", system-ui, -apple-system, sans-serif',
    fontMono: '"JetBrains Mono", "Cascadia Code", monospace',
    fontSize: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem", // 36px
      "5xl": "3rem", // 48px
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
    lineHeight: {
      tight: 1.15,
      normal: 1.6,
      relaxed: 1.8,
    },
  };

  // ──────────────────────────────────────────────────────────────
  // BORDER RADIUS
  // ──────────────────────────────────────────────────────────────

  const RADIUS = {
    sm: "8px",
    md: "12px",
    lg: "14px",
    xl: "20px",
    "2xl": "24px",
    full: "999px",
  };

  // ──────────────────────────────────────────────────────────────
  // SHADOWS
  // ──────────────────────────────────────────────────────────────

  const SHADOWS = {
    sm: "0 2px 8px rgba(0, 0, 0, 0.1)",
    md: "0 4px 12px rgba(0, 0, 0, 0.15)",
    lg: "0 8px 24px rgba(0, 0, 0, 0.2)",
    xl: "0 12px 32px rgba(0, 0, 0, 0.25)",
    "2xl": "0 18px 40px rgba(0, 0, 0, 0.22)",
    glow: "0 4px 22px rgba(0, 0, 0, 0.22)",
  };

  // ──────────────────────────────────────────────────────────────
  // TRANSITIONS & ANIMATIONS
  // ──────────────────────────────────────────────────────────────

  const TRANSITIONS = {
    fast: "0.15s ease",
    base: "0.25s ease",
    slow: "0.35s ease",
  };

  const ANIMATIONS = {
    fadeIn: "fadeIn 0.25s ease forwards",
    slideUp: "slideUp 0.35s ease forwards",
    slideDown: "slideDown 0.35s ease forwards",
    scaleIn: "scaleIn 0.25s ease forwards",
    spin: "spin 1s linear infinite",
    pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
  };

  // ──────────────────────────────────────────────────────────────
  // BREAKPOINTS
  // ──────────────────────────────────────────────────────────────

  const BREAKPOINTS = {
    mobile: "640px",
    tablet: "1024px",
    desktop: "1200px",
  };

  // ──────────────────────────────────────────────────────────────
  // Z-INDEX SCALE
  // ──────────────────────────────────────────────────────────────

  const Z_INDEX = {
    base: 1,
    dropdown: 10,
    modal: 50,
    popover: 100,
    tooltip: 150,
    notification: 200,
  };

  // ──────────────────────────────────────────────────────────────
  // UTILITY FUNCTIONS
  // ──────────────────────────────────────────────────────────────

  /**
   * Get current theme (dark/light)
   */
  function getTheme() {
    const theme = document.documentElement.getAttribute("data-theme") || "dark";
    return theme === "light" ? "light" : "dark";
  }

  /**
   * Get color for current theme
   */
  function getColor(colorKey) {
    const theme = getTheme();
    return COLORS[theme][colorKey] || COLORS.dark[colorKey];
  }

  /**
   * Get category accent color
   */
  function getCategoryColor(category) {
    return CATEGORY_COLORS[category]?.accent || "#00e5ff";
  }

  /**
   * Get category accent RGB values (for use in rgba())
   */
  function getCategoryColorRgb(category) {
    return CATEGORY_COLORS[category]?.rgb || "0,229,255";
  }

  /**
   * Apply CSS custom properties to root element
   */
  function applyCSSVariables() {
    const theme = getTheme();
    const colors = COLORS[theme];
    const root = document.documentElement;

    // Apply colors
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });

    // Apply spacing
    Object.entries(SPACING).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });

    // Apply typography
    Object.entries(TYPOGRAPHY).forEach(([key, value]) => {
      if (typeof value === "object") {
        Object.entries(value).forEach(([subKey, subValue]) => {
          root.style.setProperty(`--${key}-${subKey}`, subValue);
        });
      } else {
        root.style.setProperty(`--${key}`, value);
      }
    });

    // Apply borders
    Object.entries(RADIUS).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });

    // Apply shadows
    Object.entries(SHADOWS).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });

    // Apply transitions
    Object.entries(TRANSITIONS).forEach(([key, value]) => {
      root.style.setProperty(`--transition-${key}`, value);
    });

    // Apply z-index
    Object.entries(Z_INDEX).forEach(([key, value]) => {
      root.style.setProperty(`--z-${key}`, value);
    });
  }

  /**
   * Watch theme changes and update CSS variables
   */
  function watchThemeChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "data-theme"
        ) {
          applyCSSVariables();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
  }

  /**
   * Create media query for responsive design
   */
  function createMediaQuery(breakpoint) {
    const bp = BREAKPOINTS[breakpoint] || breakpoint;
    return `(max-width: ${bp})`;
  }

  /**
   * Check if viewport matches breakpoint
   */
  function isViewport(breakpoint) {
    return window.matchMedia(createMediaQuery(breakpoint)).matches;
  }

  // ──────────────────────────────────────────────────────────────
  // EXPORT & INITIALIZATION
  // ──────────────────────────────────────────────────────────────

  // Export to global scope for use in other scripts
  window.BooksDesignTokens = {
    COLORS,
    CATEGORY_COLORS,
    SPACING,
    TYPOGRAPHY,
    RADIUS,
    SHADOWS,
    TRANSITIONS,
    ANIMATIONS,
    BREAKPOINTS,
    Z_INDEX,
    getTheme,
    getColor,
    getCategoryColor,
    getCategoryColorRgb,
    applyCSSVariables,
    watchThemeChanges,
    createMediaQuery,
    isViewport,
  };

  // Initialize on load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      applyCSSVariables();
      watchThemeChanges();
    });
  } else {
    applyCSSVariables();
    watchThemeChanges();
  }
})();
