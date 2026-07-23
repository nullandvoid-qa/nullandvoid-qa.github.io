(function () {
  "use strict";

  const KNOWN_MARKDOWN_IDS = new Set([
    "l1", "l2", "l3", "l4", "l5", "l6", "l7", "l8", "l9", "l10", "l11", "l12", "l13", "l14", "l15", "l16",
    "perf-l1", "perf-l2", "perf-l3", "perf-l4", "perf-l5", "perf-l6", "perf-l7",
  ]);

  function parseFrontmatter(markdown) {
    const match = markdown.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
    if (!match) {
      return { data: {}, body: markdown };
    }

    const body = markdown.replace(match[0], "");
    const data = {};
    match[1].split(/\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const separator = trimmed.indexOf(":");
      if (separator === -1) return;
      const key = trimmed.slice(0, separator).trim();
      const value = trimmed.slice(separator + 1).trim();
      data[key] = value;
    });

    return { data, body };
  }

  function simpleMarkdownToHtml(markdown) {
    if (!markdown || !markdown.trim()) {
      return "";
    }

    const trimmed = markdown.trim();
    if (/<[a-z][\s\S]*>/i.test(trimmed)) {
      return trimmed;
    }

    return trimmed
      .replace(/^### (.*)$/gm, '<h3>$1</h3>')
      .replace(/^## (.*)$/gm, '<h2>$1</h2>')
      .replace(/^# (.*)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>');
  }

  function resolveMarkdownPath(lessonId, markdownMap = {}) {
    if (markdownMap[lessonId]) {
      return markdownMap[lessonId];
    }

    if (!KNOWN_MARKDOWN_IDS.has(lessonId)) {
      return null;
    }

    if (typeof window !== "undefined" && window.location?.origin) {
      return `/content/lessons/${lessonId}.md`;
    }

    return null;
  }

  async function loadLessonContent(lesson, options = {}) {
    const fetchImpl = options.fetchImpl || fetch;
    const markdownMap = options.markdownMap || window.TG_LESSON_MARKDOWN_MAP || {};
    const sourcePath = resolveMarkdownPath(lesson.id, markdownMap);

    if (!sourcePath) {
      return {
        content: lesson.content || "",
        title: lesson.title || "",
        duration: lesson.duration || "",
      };
    }

    try {
      const response = await fetchImpl(sourcePath, { cache: "no-store" });
      if (!response || !response.ok) {
        throw new Error(`Failed to load lesson markdown: ${sourcePath}`);
      }
      const markdown = await response.text();
      const { data, body } = parseFrontmatter(markdown);
      return {
        content: simpleMarkdownToHtml(body),
        title: data.title || lesson.title || "",
        duration: data.duration || lesson.duration || "",
      };
    } catch (error) {
      if (sourcePath && sourcePath !== "/content/lessons/undefined.md") {
        console.warn(error);
      }
      return {
        content: lesson.content || "",
        title: lesson.title || "",
        duration: lesson.duration || "",
      };
    }
  }

  const api = {
    parseFrontmatter,
    simpleMarkdownToHtml,
    resolveMarkdownPath,
    loadLessonContent,
  };

  window.NVLessonContent = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})();
