#!/usr/bin/env node
'use strict';

const fs = require('node:fs/promises');
const path = require('node:path');
const readline = require('node:readline/promises');
const { spawn } = require('node:child_process');
const { stdin, stdout } = require('node:process');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUT_DIR = path.join(ROOT_DIR, 'ssh');
const FPK_APP_DIR = path.join(ROOT_DIR, 'fpk', 'FnOS_UI_Mods');
const DEFAULT_BRAND = '#0066ff';

const FILES = {
  js: path.join(ROOT_DIR, 'mod.js'),
  basicCss: path.join(ROOT_DIR, 'basic_mod.css'),
  windowsTitlebarCss: path.join(ROOT_DIR, 'windows_titlebar_mod.css'),
  macTitlebarCss: path.join(ROOT_DIR, 'mac_titlebar_mod.css'),
  classicLaunchpadCss: path.join(ROOT_DIR, 'classic_launchpad_mod.css'),
  spotlightLaunchpadCss: path.join(ROOT_DIR, 'spotlight_launchpad_mod.css')
};

const LEGACY_BUILD_FILES = [
  'mod.windows.css',
  'mod.mac.css',
  'mod.basic.css'
];

const FPK_SYNC_FILE_MAPPINGS = [
  ['basic_mod.css', 'fpk/FnOS_UI_Mods/app/www/assets/templates/basic_mod.css'],
  ['mac_titlebar_mod.css', 'fpk/FnOS_UI_Mods/app/www/assets/templates/mac_titlebar_mod.css'],
  ['windows_titlebar_mod.css', 'fpk/FnOS_UI_Mods/app/www/assets/templates/windows_titlebar_mod.css'],
  ['mod.js', 'fpk/FnOS_UI_Mods/app/www/assets/templates/mod.js'],
  [
    'spotlight_launchpad_mod.css',
    'fpk/FnOS_UI_Mods/app/www/assets/templates/spotlight_launchpad_mod.css'
  ],
  ['classic_launchpad_mod.css', 'fpk/FnOS_UI_Mods/app/www/assets/templates/classic_launchpad_mod.css'],
  ['fonts/SarasaMonoSC-SemiBold.ttf', 'fpk/FnOS_UI_Mods/app/www/fonts/SarasaMonoSC-SemiBold.ttf'],
  ['fonts/SarasaUiSC-SemiBold.ttf', 'fpk/FnOS_UI_Mods/app/www/fonts/SarasaUiSC-SemiBold.ttf']
];

const FPK_SYNC_DIR_MAPPINGS = [['prefect_icon', 'fpk/FnOS_UI_Mods/app/www/prefect_icon']];

const FNPACK_BINARIES = {
  win32: {
    x64: 'fnpack-1.2.1-windows-amd64.exe'
  },
  linux: {
    x64: 'fnpack-1.2.1-linux-amd64',
    arm64: 'fnpack-1.2.1-linux-arm64'
  },
  darwin: {
    x64: 'fnpack-1.2.1-darwin-amd64',
    arm64: 'fnpack-1.2.1-darwin-arm64'
  }
};

const FNPACK_DIR_CANDIDATES = [path.join(ROOT_DIR, 'scripts', 'fnpack'), path.join(ROOT_DIR, 'script', 'fnpack')];

const ICONS = {
  step: '↪',
  info: '●',
  ok: '✓',
  warn: '⚠',
  error: '⊗'
};

function supportsColor() {
  if (!stdout.isTTY) return false;
  if (process.env.NO_COLOR) return false;
  if (process.env.TERM === 'dumb') return false;
  return true;
}

function createPaint() {
  const enabled = supportsColor();
  const wrap = (code, text) => (enabled ? `${code}${text}\x1b[0m` : text);

  return {
    title: (text) => wrap('\x1b[1;95m', text),
    info: (text) => wrap('\x1b[1;36m', text),
    ok: (text) => wrap('\x1b[1;32m', text),
    warn: (text) => wrap('\x1b[1;33m', text),
    error: (text) => wrap('\x1b[1;31m', text),
    dim: (text) => wrap('\x1b[2m', text)
  };
}

function createI18n(lang) {
  const zh = {
    languagePrompt: '请选择语言 / Select language [1=中文, 2=English]（默认 1）：',
    languageInvalid: '请输入 1 或 2。',
    logoSubtitle: 'FnOS UI Mods 构建工具',
    logoHint: '本工具将引导你进行配置，并将最终 mod 构建到 ssh 目录',
    titlebarPrompt: '请选择标题栏风格 [1=Windows, 2=macOS]：',
    titlebarInvalid: '请输入 1 或 2。',
    launchpadPrompt: '请选择启动台风格 [1=Classic, 2=Spotlight]：',
    launchpadInvalid: '请输入 1 或 2。',
    brandPrompt: `请输入主题色 HEX（回车跳过，不替换默认配色）：`,
    brandInvalid: '颜色格式错误，例如：#0066ff',
    fontEnablePrompt: '是否启用字体替换？[y/N]：',
    fontFamilyPrompt: '请输入字体族（必填，例如: "Inter Variable", "Inter", sans-serif）：',
    fontFamilyInvalid: '字体族不能为空。',
    fontWeightPrompt: '请输入字体粗细（可选，例如: 450 或 normal）：',
    fontFeaturePrompt: '请输入 font-feature-settings（可选，例如: "tnum" 1）：',
    missingFile: (filePath) => `缺少必需文件: ${filePath}`,
    wroteFile: (filePath) => `已写入 ${filePath}`,
    buildComplete: (titlebar, launchpad, brandLabel) =>
      `构建完成（标题栏=${titlebar}，启动台=${launchpad}，主题色=${brandLabel}）`,
    themeSkipped: '未替换（保持默认）',
    removedLegacy: (filePath) => `已清理遗留文件 ${filePath}`,
    syncStart: '开始同步根目录资源到 fpk 模板目录',
    syncUpdated: (src, dst) => `已同步 ${src} -> ${dst}`,
    syncSkippedSource: (src) => `跳过（源文件不存在）: ${src}`,
    syncSkippedTarget: (dst) => `跳过（目标文件不存在）: ${dst}`,
    syncSkippedDirSource: (src) => `跳过（源目录不存在）: ${src}`,
    syncSkippedDirTarget: (dst) => `跳过（目标目录不存在）: ${dst}`,
    syncSummary: (updated, skipped, total) => `同步完成：updated=${updated}, skipped=${skipped}, total=${total}`,
    fnpackStart: (filePath) => `开始执行 fnpack 打包：${filePath}`,
    fnpackUnsupportedPlatform: (platform, arch) => `不支持的平台或架构: ${platform}/${arch}`,
    fnpackMissingBinary: (fileName) =>
      `未找到 fnpack 可执行文件 ${fileName}（已检查 scripts/fnpack 与 script/fnpack）`,
    fnpackBuildFailed: (code) => `fnpack build 执行失败，退出码: ${code}`,
    fnpackBuildOutput: (filePath) => `已生成 fpk 文件：${filePath}`,
    fnpackBuildOutputUnknown: 'fnpack build 执行完成，但未检测到新增或更新的 .fpk 文件',
    buildFailed: (message) => `构建失败: ${message}`,
    interactiveRequired:
      '需要交互式终端。请在本地命令行执行：node scripts/build.js'
  };

  const en = {
    languagePrompt: 'Select language [1=Chinese, 2=English] (default 2):',
    languageInvalid: 'Please input 1 or 2.',
    logoSubtitle: 'FnOS UI Mods Builder',
    logoHint: 'This tool will guide you through the configuration and build the final mod to the ssh directory',
    titlebarPrompt: 'Select titlebar style [1=Windows, 2=macOS]:',
    titlebarInvalid: 'Please input 1 or 2.',
    launchpadPrompt: 'Select launchpad style [1=Classic, 2=Spotlight]:',
    launchpadInvalid: 'Please input 1 or 2.',
    brandPrompt: 'Brand color hex (press Enter to skip and keep default):',
    brandInvalid: 'Invalid hex. Example: #0066ff',
    fontEnablePrompt: 'Enable custom font override? [y/N]:',
    fontFamilyPrompt:
      'Font family stack (required, e.g. "Inter Variable", "Inter", sans-serif):',
    fontFamilyInvalid: 'Font family cannot be empty.',
    fontWeightPrompt: 'Font weight (optional, e.g. 450 or normal):',
    fontFeaturePrompt: 'font-feature-settings (optional, e.g. "tnum" 1):',
    missingFile: (filePath) => `Missing required file: ${filePath}`,
    wroteFile: (filePath) => `Wrote ${filePath}`,
    buildComplete: (titlebar, launchpad, brandLabel) =>
      `Build complete (titlebar=${titlebar}, launchpad=${launchpad}, brand=${brandLabel}).`,
    themeSkipped: 'skipped (default)',
    removedLegacy: (filePath) => `Removed legacy file ${filePath}`,
    syncStart: 'Syncing root assets to fpk templates',
    syncUpdated: (src, dst) => `Synced ${src} -> ${dst}`,
    syncSkippedSource: (src) => `Skipped (missing source): ${src}`,
    syncSkippedTarget: (dst) => `Skipped (missing target): ${dst}`,
    syncSkippedDirSource: (src) => `Skipped (missing source dir): ${src}`,
    syncSkippedDirTarget: (dst) => `Skipped (missing target dir): ${dst}`,
    syncSummary: (updated, skipped, total) => `Sync done: updated=${updated}, skipped=${skipped}, total=${total}`,
    fnpackStart: (filePath) => `Running fnpack build with ${filePath}`,
    fnpackUnsupportedPlatform: (platform, arch) => `Unsupported platform/arch: ${platform}/${arch}`,
    fnpackMissingBinary: (fileName) =>
      `Cannot find fnpack binary ${fileName} (checked scripts/fnpack and script/fnpack)`,
    fnpackBuildFailed: (code) => `fnpack build failed with exit code: ${code}`,
    fnpackBuildOutput: (filePath) => `Generated fpk package: ${filePath}`,
    fnpackBuildOutputUnknown: 'fnpack build completed, but no new/updated .fpk artifact was detected',
    buildFailed: (message) => `Build failed: ${message}`,
    interactiveRequired:
      'Interactive terminal required. Please run: node scripts/build.js'
  };

  return lang === 'en' ? en : zh;
}

function printLogo(t, paint) {
  console.log(paint.info(`${ICONS.info} ${t.logoSubtitle}`));
  console.log(paint.dim(`  ${t.logoHint}`));
}

async function ensureFileExists(filePath) {
  try {
    await fs.access(filePath);
  } catch {
    throw new Error(path.relative(ROOT_DIR, filePath));
  }
}

function buildBanner() {
  const timestamp = new Date().toISOString();
  return [
    '/* ============================================= */',
    '/* Auto-generated by scripts/build.js            */',
    `/* Build time: ${timestamp} */`,
    '/* ============================================= */',
    ''
  ].join('\n');
}

function normalizeText(content) {
  return content.replace(/\r\n/g, '\n').trimEnd() + '\n';
}

function normalizeHex(value) {
  if (typeof value !== 'string') return null;
  const hex = value.trim().toLowerCase();
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(hex)) return null;

  if (hex.length === 4) {
    return `#${hex
      .slice(1)
      .split('')
      .map((char) => char + char)
      .join('')}`;
  }

  return hex;
}

function clampChannel(value) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function rgbToHsl(r, g, b) {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;

  switch (max) {
    case rn:
      h = (gn - bn) / d + (gn < bn ? 6 : 0);
      break;
    case gn:
      h = (bn - rn) / d + 2;
      break;
    default:
      h = (rn - gn) / d + 4;
      break;
  }

  h /= 6;
  return { h, s, l };
}

function hue2rgb(p, q, t) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const v = clampChannel(l * 255);
    return { r: v, g: v, b: v };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: clampChannel(hue2rgb(p, q, h + 1 / 3) * 255),
    g: clampChannel(hue2rgb(p, q, h) * 255),
    b: clampChannel(hue2rgb(p, q, h - 1 / 3) * 255)
  };
}

function rgbToHex({ r, g, b }) {
  return (
    '#' +
    [r, g, b]
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function hexToRgb(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;

  const intValue = parseInt(normalized.slice(1), 16);
  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255
  };
}

function clampBrandLightness(hex) {
  const rgb = hexToRgb(hex) || hexToRgb(DEFAULT_BRAND);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const clampedL = Math.min(0.7, Math.max(0.3, hsl.l));
  return rgbToHex(hslToRgb(hsl.h, hsl.s, clampedL));
}

function formatRgb(rgb) {
  return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
}

function mixWithBlack(rgb, factor) {
  return {
    r: clampChannel(rgb.r * factor),
    g: clampChannel(rgb.g * factor),
    b: clampChannel(rgb.b * factor)
  };
}

function mixWithWhite(rgb, mix) {
  const keep = 1 - mix;
  return {
    r: clampChannel(rgb.r * keep + 255 * mix),
    g: clampChannel(rgb.g * keep + 255 * mix),
    b: clampChannel(rgb.b * keep + 255 * mix)
  };
}

function generateBrandPalette(brandHex) {
  const base = hexToRgb(brandHex) || hexToRgb(DEFAULT_BRAND);
  const darkFactors = [0.4, 0.55, 0.7, 0.85, 1];
  const lightMix = [0.2, 0.4, 0.6, 0.8, 0.92];

  const palette = [];
  darkFactors.forEach((factor) => palette.push(formatRgb(mixWithBlack(base, factor))));
  lightMix.forEach((mix) => palette.push(formatRgb(mixWithWhite(base, mix))));
  return palette;
}

function buildThemeCss(brandHex) {
  const clamped = clampBrandLightness(brandHex);
  const palette = generateBrandPalette(clamped);
  const selectors = [
    ':root',
    'body',
    '#root',
    '.semi-theme-default',
    '.semi-theme-dark',
    '.semi-theme',
    '[data-theme]',
    '*'
  ].join(', ');

  const lines = palette
    .map((value, index) => `  --semi-brand-${index}: ${value} !important;`)
    .join('\n');

  return `${selectors} {\n${lines}\n}`;
}

function buildFontCss(fontConfig) {
  if (!fontConfig.enabled) return '';

  const declarations = [`  font-family: ${fontConfig.family} !important;`];
  if (fontConfig.weight) {
    declarations.push(`  font-weight: ${fontConfig.weight} !important;`);
  }
  if (fontConfig.featureSettings) {
    declarations.push(`  font-feature-settings: ${fontConfig.featureSettings} !important;`);
  }

  const selectors = [
    ':root',
    'body',
    '#root',
    '#root *',
    '.semi-theme',
    '.semi-theme *'
  ].join(', ');

  return `${selectors} {\n${declarations.join('\n')}\n}`;
}

function mergeCss(parts, overrides) {
  const content = parts
    .map((part) => `/* ----- ${path.basename(part.filePath)} ----- */\n${normalizeText(part.content)}`)
    .join('\n');

  const extra = [];
  if (overrides.themeCss) {
    extra.push(`/* ----- generated.theme.css ----- */\n${normalizeText(overrides.themeCss)}`);
  }
  if (overrides.fontCss) {
    extra.push(`/* ----- generated.font.css ----- */\n${normalizeText(overrides.fontCss)}`);
  }

  return buildBanner() + [content, ...extra].join('\n');
}

async function writeText(filePath, content, t, paint) {
  await fs.writeFile(filePath, content, 'utf8');
  console.log(paint.ok(`${ICONS.ok} ${t.wroteFile(path.relative(ROOT_DIR, filePath))}`));
}

async function cleanupLegacyFiles(t, paint) {
  let printedSeparator = false;
  for (const fileName of LEGACY_BUILD_FILES) {
    const target = path.join(OUT_DIR, fileName);
    try {
      await fs.access(target);
      if (!printedSeparator) {
        console.log('');
        printedSeparator = true;
      }
      await fs.rm(target, { force: true });
      console.log(paint.dim(`${ICONS.info} ${t.removedLegacy(path.relative(ROOT_DIR, target))}`));
    } catch {
      // ignore cleanup errors
    }
  }
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

async function pathExists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function filesAreEqual(sourcePath, targetPath) {
  const [sourceStat, targetStat] = await Promise.all([fs.stat(sourcePath), fs.stat(targetPath)]);
  if (sourceStat.size !== targetStat.size) {
    return false;
  }

  const [sourceBuffer, targetBuffer] = await Promise.all([
    fs.readFile(sourcePath),
    fs.readFile(targetPath)
  ]);
  return sourceBuffer.equals(targetBuffer);
}

async function listFilesRecursively(directoryPath, basePath = directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      const nestedFiles = await listFilesRecursively(fullPath, basePath);
      files.push(...nestedFiles);
      continue;
    }
    if (entry.isFile()) {
      files.push(path.relative(basePath, fullPath));
    }
  }

  return files.sort((left, right) => left.localeCompare(right));
}

async function syncOneFile(
  sourceRelativePath,
  targetRelativePath,
  stats,
  t,
  paint,
  options = {}
) {
  const sourcePath = path.join(ROOT_DIR, sourceRelativePath);
  const targetPath = path.join(ROOT_DIR, targetRelativePath);
  const allowCreateTarget = options.allowCreateTarget === true;
  stats.total += 1;

  if (!(await pathExists(sourcePath))) {
    console.log(paint.warn(`${ICONS.warn} ${t.syncSkippedSource(toPosixPath(sourceRelativePath))}`));
    stats.skipped += 1;
    return;
  }

  if (!(await pathExists(targetPath))) {
    if (!allowCreateTarget) {
      console.log(paint.warn(`${ICONS.warn} ${t.syncSkippedTarget(toPosixPath(targetRelativePath))}`));
      stats.skipped += 1;
      return;
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.copyFile(sourcePath, targetPath);
    console.log(
      paint.ok(
        `${ICONS.ok} ${t.syncUpdated(toPosixPath(sourceRelativePath), toPosixPath(targetRelativePath))}`
      )
    );
    stats.updated += 1;
    return;
  }

  if (await filesAreEqual(sourcePath, targetPath)) {
    return;
  }

  await fs.copyFile(sourcePath, targetPath);
  console.log(
    paint.ok(
      `${ICONS.ok} ${t.syncUpdated(toPosixPath(sourceRelativePath), toPosixPath(targetRelativePath))}`
    )
  );
  stats.updated += 1;
}

async function syncAssetsToFpk(t, paint) {
  const stats = {
    updated: 0,
    skipped: 0,
    total: 0
  };

  console.log('');
  console.log(paint.info(`${ICONS.info} ${t.syncStart}`));

  for (const [sourceRelativePath, targetRelativePath] of FPK_SYNC_FILE_MAPPINGS) {
    await syncOneFile(sourceRelativePath, targetRelativePath, stats, t, paint);
  }

  for (const [sourceDirRelativePath, targetDirRelativePath] of FPK_SYNC_DIR_MAPPINGS) {
    const sourceDirPath = path.join(ROOT_DIR, sourceDirRelativePath);
    const targetDirPath = path.join(ROOT_DIR, targetDirRelativePath);

    if (!(await pathExists(sourceDirPath))) {
      console.log(paint.warn(`${ICONS.warn} ${t.syncSkippedDirSource(toPosixPath(sourceDirRelativePath))}`));
      continue;
    }

    await fs.mkdir(targetDirPath, { recursive: true });

    const sourceFiles = await listFilesRecursively(sourceDirPath);
    for (const relativeFilePath of sourceFiles) {
      const sourceRelativePath = toPosixPath(path.join(sourceDirRelativePath, relativeFilePath));
      const targetRelativePath = toPosixPath(path.join(targetDirRelativePath, relativeFilePath));
      await syncOneFile(sourceRelativePath, targetRelativePath, stats, t, paint, {
        allowCreateTarget: true
      });
    }
  }

  console.log(paint.info(`${ICONS.info} ${t.syncSummary(stats.updated, stats.skipped, stats.total)}`));
}

function resolveFnpackBinaryName(t) {
  const binaryName = FNPACK_BINARIES[process.platform]?.[process.arch];
  if (!binaryName) {
    throw new Error(t.fnpackUnsupportedPlatform(process.platform, process.arch));
  }
  return binaryName;
}

async function resolveFnpackBinaryPath(t) {
  const binaryName = resolveFnpackBinaryName(t);
  for (const directory of FNPACK_DIR_CANDIDATES) {
    const candidate = path.join(directory, binaryName);
    if (await pathExists(candidate)) {
      return candidate;
    }
  }

  throw new Error(t.fnpackMissingBinary(binaryName));
}

async function listFpkArtifacts(directoryPath) {
  const entries = await fs.readdir(directoryPath, { withFileTypes: true });
  const artifacts = new Map();

  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.fpk')) {
      continue;
    }
    const filePath = path.join(directoryPath, entry.name);
    const stat = await fs.stat(filePath);
    artifacts.set(entry.name, stat.mtimeMs);
  }

  return artifacts;
}

function detectChangedFpkArtifact(beforeArtifacts, afterArtifacts, directoryPath) {
  let newestArtifactName = null;
  let newestArtifactMtime = -1;

  for (const [name, mtime] of afterArtifacts.entries()) {
    const previousMtime = beforeArtifacts.get(name);
    const changed = previousMtime === undefined || mtime > previousMtime;
    if (!changed) continue;
    if (mtime > newestArtifactMtime) {
      newestArtifactMtime = mtime;
      newestArtifactName = name;
    }
  }

  if (!newestArtifactName) return null;
  return path.join(directoryPath, newestArtifactName);
}

async function runFnpackBuild(t, paint) {
  const fnpackPath = await resolveFnpackBinaryPath(t);
  const fnpackRelativePath = toPosixPath(path.relative(ROOT_DIR, fnpackPath));

  if (process.platform !== 'win32') {
    await fs.chmod(fnpackPath, 0o755).catch(() => undefined);
  }

  const beforeArtifacts = await listFpkArtifacts(FPK_APP_DIR);
  console.log('');
  console.log(paint.info(`${ICONS.info} ${t.fnpackStart(fnpackRelativePath)}`));

  await new Promise((resolve, reject) => {
    const command = spawn(fnpackPath, ['build', '--directory', './'], {
      cwd: FPK_APP_DIR,
      stdio: 'inherit'
    });

    command.once('error', reject);
    command.once('close', (code) => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(t.fnpackBuildFailed(code ?? 'unknown')));
    });
  });

  const afterArtifacts = await listFpkArtifacts(FPK_APP_DIR);
  const artifactPath = detectChangedFpkArtifact(beforeArtifacts, afterArtifacts, FPK_APP_DIR);
  if (artifactPath) {
    console.log(paint.ok(`${ICONS.ok} ${t.fnpackBuildOutput(toPosixPath(path.relative(ROOT_DIR, artifactPath)))}`));
    return;
  }

  console.log(paint.dim(`${ICONS.info} ${t.fnpackBuildOutputUnknown}`));
}

async function askQuestions(paint) {
  if (!stdin.isTTY || !stdout.isTTY) {
    throw new Error(createI18n('en').interactiveRequired);
  }

  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    let lang = '';
    while (!lang) {
      const answer = (await rl.question(paint.info(`${ICONS.step} ${createI18n('zh').languagePrompt} `)))
        .trim()
        .toLowerCase();
      if (!answer || answer === '1' || answer === 'zh' || answer === 'cn') {
        lang = 'zh';
      } else if (answer === '2' || answer === 'en') {
        lang = 'en';
      } else {
        console.log(paint.warn(`${ICONS.warn} ${createI18n('zh').languageInvalid}`));
      }
    }

    const t = createI18n(lang);
    printLogo(t, paint);

    let titlebar = '';
    while (!titlebar) {
      const answer = (await rl.question(paint.info(`${ICONS.step} ${t.titlebarPrompt} `)))
        .trim()
        .toLowerCase();
      if (answer === '1' || answer === 'windows' || answer === 'w') {
        titlebar = 'windows';
      } else if (answer === '2' || answer === 'mac' || answer === 'm') {
        titlebar = 'mac';
      } else {
        console.log(paint.warn(`${ICONS.warn} ${t.titlebarInvalid}`));
      }
    }

    let launchpad = '';
    while (!launchpad) {
      const answer = (await rl.question(paint.info(`${ICONS.step} ${t.launchpadPrompt} `)))
        .trim()
        .toLowerCase();
      if (answer === '1' || answer === 'classic' || answer === 'c') {
        launchpad = 'classic';
      } else if (answer === '2' || answer === 'spotlight' || answer === 's') {
        launchpad = 'spotlight';
      } else {
        console.log(paint.warn(`${ICONS.warn} ${t.launchpadInvalid}`));
      }
    }

    let brandColor = DEFAULT_BRAND;
    let themeEnabled = false;
    while (true) {
      const answer = (await rl.question(paint.info(`${ICONS.step} ${t.brandPrompt} `))).trim();
      if (!answer) break;
      const normalized = normalizeHex(answer);
      if (normalized) {
        brandColor = normalized;
        themeEnabled = true;
        break;
      }
      console.log(paint.warn(`${ICONS.warn} ${t.brandInvalid}`));
    }

    const fontEnableAnswer = (await rl.question(
      paint.info(`${ICONS.step} ${t.fontEnablePrompt} `)
    ))
      .trim()
      .toLowerCase();
    const fontEnabled = ['y', 'yes', '是', '1'].includes(fontEnableAnswer);

    const fontConfig = {
      enabled: false,
      family: '',
      weight: '',
      featureSettings: ''
    };

    if (fontEnabled) {
      while (!fontConfig.family) {
        const family = (await rl.question(paint.info(`${ICONS.step} ${t.fontFamilyPrompt} `))).trim();
        if (family) {
          fontConfig.family = family;
          fontConfig.enabled = true;
          break;
        }
        console.log(paint.warn(`${ICONS.warn} ${t.fontFamilyInvalid}`));
      }

      fontConfig.weight = (await rl.question(paint.info(`${ICONS.step} ${t.fontWeightPrompt} `))).trim();
      fontConfig.featureSettings = (await rl.question(
        paint.info(`${ICONS.step} ${t.fontFeaturePrompt} `)
      )).trim();
    }

    return { titlebar, launchpad, brandColor, themeEnabled, fontConfig, t };
  } finally {
    rl.close();
  }
}

async function main() {
  const paint = createPaint();
  const { titlebar, launchpad, brandColor, themeEnabled, fontConfig, t } = await askQuestions(paint);

  await Promise.all([
    ensureFileExists(FILES.js),
    ensureFileExists(FILES.basicCss),
    ensureFileExists(FILES.windowsTitlebarCss),
    ensureFileExists(FILES.macTitlebarCss),
    ensureFileExists(FILES.classicLaunchpadCss),
    ensureFileExists(FILES.spotlightLaunchpadCss)
  ]).catch((error) => {
    throw new Error(t.missingFile(error.message));
  });

  await fs.mkdir(OUT_DIR, { recursive: true });

  const [
    jsContent,
    basicCssContent,
    windowsTitlebarCssContent,
    macTitlebarCssContent,
    classicLaunchpadCssContent,
    spotlightLaunchpadCssContent
  ] =
    await Promise.all([
      fs.readFile(FILES.js, 'utf8'),
      fs.readFile(FILES.basicCss, 'utf8'),
      fs.readFile(FILES.windowsTitlebarCss, 'utf8'),
      fs.readFile(FILES.macTitlebarCss, 'utf8'),
      fs.readFile(FILES.classicLaunchpadCss, 'utf8'),
      fs.readFile(FILES.spotlightLaunchpadCss, 'utf8')
    ]);

  const titlebarCssContent =
    titlebar === 'windows' ? windowsTitlebarCssContent : macTitlebarCssContent;
  const titlebarFilePath = titlebar === 'windows' ? FILES.windowsTitlebarCss : FILES.macTitlebarCss;
  const launchpadCssContent =
    launchpad === 'spotlight' ? spotlightLaunchpadCssContent : classicLaunchpadCssContent;
  const launchpadFilePath =
    launchpad === 'spotlight' ? FILES.spotlightLaunchpadCss : FILES.classicLaunchpadCss;

  const mergedCss = mergeCss(
    [
      { filePath: FILES.basicCss, content: basicCssContent },
      { filePath: titlebarFilePath, content: titlebarCssContent },
      { filePath: launchpadFilePath, content: launchpadCssContent }
    ],
    {
      themeCss: themeEnabled ? buildThemeCss(brandColor) : '',
      fontCss: buildFontCss(fontConfig)
    }
  );

  const builtJs = buildBanner() + normalizeText(jsContent);

  await Promise.all([
    writeText(path.join(OUT_DIR, 'mod.js'), builtJs, t, paint),
    writeText(path.join(OUT_DIR, 'mod.css'), mergedCss, t, paint)
  ]);
  await cleanupLegacyFiles(t, paint);
  await syncAssetsToFpk(t, paint);
  await runFnpackBuild(t, paint);

  const brandLabel = themeEnabled ? brandColor : t.themeSkipped;
  console.log(paint.ok(`${ICONS.ok} ${t.buildComplete(titlebar, launchpad, brandLabel)}`));
}

main().catch((error) => {
  const paint = createPaint();
  const t = createI18n('zh');
  console.error(paint.error(`${ICONS.error} ${t.buildFailed(error.message)}`));
  process.exit(1);
});
