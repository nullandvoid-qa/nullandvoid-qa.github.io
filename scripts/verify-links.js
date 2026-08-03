#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const ignoredDirs = new Set(['.git', 'node_modules', 'coverage', 'playwright-report', 'test-results', 'reports', 'tmp']);
const allowedExtensions = new Set(['.html', '.md']);
const ignoredLinkPrefixes = ['http://', 'https://', 'mailto:', 'tel:', 'javascript:', 'data:', 'about:', 'ftp:'];
const ignoredLinkSuffixes = ['?v=', '?version=', '&v='];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name)) {
        files.push(...walk(fullPath));
      }
      continue;
    }

    if (entry.isFile() && allowedExtensions.has(path.extname(entry.name).toLowerCase())) {
      files.push(fullPath);
    }
  }

  return files;
}

function slugify(text) {
  return String(text)
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function collectAnchors(filePath, content) {
  const anchors = new Set();

  const htmlIdRegex = /\bid=["']([^"']+)["']/g;
  let match;
  while ((match = htmlIdRegex.exec(content)) !== null) {
    anchors.add(match[1]);
  }

  const markdownHeadingRegex = /^(#{1,6})\s+(.+)$/gm;
  while ((match = markdownHeadingRegex.exec(content)) !== null) {
    anchors.add(slugify(match[2]));
  }

  return anchors;
}

function normalizeLink(rawLink) {
  let link = String(rawLink || '').trim();
  if (!link) return null;

  if (link.startsWith('<') && link.endsWith('>')) {
    link = link.slice(1, -1);
  }

  if (ignoredLinkPrefixes.some((prefix) => link.toLowerCase().startsWith(prefix))) {
    return null;
  }

  if (ignoredLinkSuffixes.some((suffix) => link.includes(suffix))) {
    return null;
  }

  if (link.startsWith('#')) {
    return { type: 'anchor', target: link.slice(1) };
  }

  const [pathPart, fragment = ''] = link.split('#', 2);
  const cleanedPath = pathPart.trim();
  if (!cleanedPath || cleanedPath === '/') {
    return { type: 'file', target: '/', fragment };
  }

  return { type: 'file', target: cleanedPath, fragment };
}

function resolveCandidates(sourceFile, targetPath) {
  const sourceDir = path.dirname(sourceFile);
  const absoluteTarget = path.resolve(sourceDir, targetPath);
  const candidates = [];

  if (targetPath.startsWith('/')) {
    candidates.push(path.resolve(rootDir, targetPath.replace(/^\//, '')));
  } else {
    candidates.push(absoluteTarget);
  }

  const withExt = [];
  const baseCandidates = [];
  for (const candidate of candidates) {
    baseCandidates.push(candidate);
    if (!path.extname(candidate)) {
      withExt.push(`${candidate}.html`, `${candidate}.md`, path.join(candidate, 'index.html'));
    }
  }

  const resolved = [];
  for (const item of [...baseCandidates, ...withExt]) {
    if (!resolved.includes(item)) {
      resolved.push(item);
    }
  }

  return resolved;
}

function existsForLink(sourceFile, linkDef) {
  if (!linkDef) return true;
  if (linkDef.type === 'anchor') {
    const anchors = collectAnchors(sourceFile, fs.readFileSync(sourceFile, 'utf8'));
    return anchors.has(linkDef.target);
  }

  const targetPath = linkDef.target;
  if (targetPath === '/') {
    return fs.existsSync(path.join(rootDir, 'index.html'));
  }

  const candidates = resolveCandidates(sourceFile, targetPath);
  const resolved = candidates.find((candidate) => fs.existsSync(candidate));
  if (!resolved) {
    return false;
  }

  if (linkDef.fragment) {
    const targetFile = resolved;
    const targetContent = fs.readFileSync(targetFile, 'utf8');
    const anchors = collectAnchors(targetFile, targetContent);
    if (!anchors.has(linkDef.fragment)) {
      return false;
    }
  }

  return true;
}

function extractLinks(filePath, content) {
  const links = [];
  const htmlRegex = /<(?:a|link|script|img)[^>]+(?:href|src)=["']([^"']+)["']/gi;
  let match;
  while ((match = htmlRegex.exec(content)) !== null) {
    links.push(match[1]);
  }

  const markdownRegex = /\[[^\]]+\]\(([^)]+)\)/g;
  while ((match = markdownRegex.exec(content)) !== null) {
    links.push(match[1]);
  }

  return links;
}

function main() {
  const files = walk(rootDir).filter((file) => file !== path.join(rootDir, 'package.json'));
  const issues = [];

  for (const file of files) {
    let content = '';
    try {
      content = fs.readFileSync(file, 'utf8');
    } catch (error) {
      continue;
    }

    for (const rawLink of extractLinks(file, content)) {
      const linkDef = normalizeLink(rawLink);
      if (!linkDef) continue;
      if (linkDef.type === 'anchor' && !linkDef.target) continue;
      if (!existsForLink(file, linkDef)) {
        issues.push({ file: path.relative(rootDir, file), link: rawLink });
      }
    }
  }

  if (issues.length) {
    console.error(`Found ${issues.length} broken internal link(s):`);
    for (const issue of issues) {
      console.error(`- ${issue.file}: ${issue.link}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(`Verified ${files.length} content files; all internal links resolved successfully.`);
}

main();
