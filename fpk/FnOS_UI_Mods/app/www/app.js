const messageEl = document.getElementById('message');
const injectBtn = document.getElementById('inject-btn');
const restoreBtn = document.getElementById('restore-btn');

const statusIndex = document.getElementById('status-index');
const statusBackup = document.getElementById('status-backup');
const statusRootPill = document.getElementById('status-root-pill');
const statusIndexPill = document.getElementById('status-index-pill');
const statusBackupPill = document.getElementById('status-backup-pill');
const statusIndexMeta = document.getElementById('status-index-meta');
const statusBackupMeta = document.getElementById('status-backup-meta');

const cssFileInput = document.getElementById('css-file');
const jsFileInput = document.getElementById('js-file');
const cssFileHint = document.getElementById('css-file-hint');
const jsFileHint = document.getElementById('js-file-hint');
const cssTextArea = document.getElementById('css-text');
const jsTextArea = document.getElementById('js-text');
const cssPathInput = document.getElementById('css-path');
const jsPathInput = document.getElementById('js-path');
const injectDelayInput = document.getElementById('inject-delay');
const cssEnableToggle = document.getElementById('css-enable');
const jsEnableToggle = document.getElementById('js-enable');
const cssOverview = document.getElementById('css-overview');
const jsOverview = document.getElementById('js-overview');
const cssOverviewDesc = document.querySelector('#css-overview p');
const jsOverviewDesc = document.querySelector('#js-overview p');
const DEFAULT_INJECT_DELAY = 5;

const presetTabBtn = document.getElementById('preset-tab-btn');
const customTabBtn = document.getElementById('custom-tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');
const modeTabs = document.querySelectorAll('.mode-tab');

const brandColorEl = document.getElementById('brandColor');
const resetBrandColorEl = document.getElementById('resetBrandColor');
const basePresetEnabledEl = document.getElementById('basePresetEnabled');
const colorSettingsEl = document.getElementById('colorSettings');
const platformGroupEl = document.getElementById('platformGroup');
const launchpadGroupEl = document.getElementById('launchpadGroup');
const styleWindowsEl = document.getElementById('styleWindows');
const styleMacEl = document.getElementById('styleMac');
const styleClassicLaunchpadEl = document.getElementById('styleClassicLaunchpad');
const styleSpotlightLaunchpadEl = document.getElementById('styleSpotlightLaunchpad');
const launchpadIconScaleEnabledEl = document.getElementById('launchpadIconScaleEnabled');
const launchpadAppListStatusEl = document.getElementById('launchpadAppListStatus');
const launchpadAppListEl = document.getElementById('launchpadAppList');
const fontOverrideEnabledEl = document.getElementById('fontOverrideEnabled');
const fontSettingsEl = document.getElementById('fontSettings');
const fontFamilyEl = document.getElementById('fontFamily');
const fontUrlEl = document.getElementById('fontUrl');
const fontWeightEl = document.getElementById('fontWeight');
const fontFeatureSettingsEl = document.getElementById('fontFeatureSettings');
const customCodeEnabledEl = document.getElementById('customCodeEnabled');
const customCodeSettingsEl = document.getElementById('customCodeSettings');
const customCssEl = document.getElementById('customCss');
const customJsEl = document.getElementById('customJs');
const presetCssSourceEl = document.getElementById('presetCssSource');
const presetJsSourceEl = document.getElementById('presetJsSource');
const presetCssFileInput = document.getElementById('preset-css-file');
const presetJsFileInput = document.getElementById('preset-js-file');
const presetCssFileHint = document.getElementById('preset-css-file-hint');
const presetJsFileHint = document.getElementById('preset-js-file-hint');
const presetCssPathInput = document.getElementById('preset-css-path');
const presetJsPathInput = document.getElementById('preset-js-path');
const authScreenEl = document.getElementById('authScreen');
const authHintEl = document.getElementById('authHint');
const authErrorEl = document.getElementById('authError');
const setupFormEl = document.getElementById('setupForm');
const loginFormEl = document.getElementById('loginForm');
const setupPasswordEl = document.getElementById('setupPassword');
const setupPassword2El = document.getElementById('setupPassword2');
const loginPasswordEl = document.getElementById('loginPassword');
const appShellEl = document.getElementById('appShell');
const logoutBtn = document.getElementById('logout-btn');

const PRESET_STORAGE_KEY = 'fnos-ui-mods:preset-config';
const DEFAULT_BRAND_COLOR = '#0066ff';
const BRAND_LIGHTNESS_MIN = 0.3;
const BRAND_LIGHTNESS_MAX = 0.7;
const AUTH_MIN_PASSWORD_LEN = 8;
const AUTH_TOKEN_STORAGE_KEY = 'fnos_ui_mods_auth_token';

const DEFAULT_PRESET_CONFIG = {
  basePresetEnabled: true,
  titlebarStyle: 'windows',
  launchpadStyle: 'classic',
  launchpadIconScaleEnabled: false,
  launchpadIconScaleSelectedKeys: [],
  brandColor: DEFAULT_BRAND_COLOR,
  fontOverrideEnabled: false,
  fontFamily: '',
  fontUrl: '',
  fontWeight: '',
  fontFeatureSettings: '',
  customCodeEnabled: false,
  customCssMode: 'text',
  customJsMode: 'text',
  customCssPath: '',
  customJsPath: '',
  customCss: '',
  customJs: '',
};

const THEME_MODE_MSG = 'fnos-ui-mods:theme-mode';
const THEME_MODE_REQ_MSG = 'fnos-ui-mods:theme-mode:request';
const CHILD_ORIGIN = window.location.origin;
const DEFAULT_PARENT_ORIGIN = `${window.location.protocol}//${window.location.hostname}:5666`;
const QUERY_PARENT_ORIGIN = new URLSearchParams(window.location.search).get('parentOrigin');
const REFERRER_PARENT_ORIGIN = (() => {
  try {
    return document.referrer ? new URL(document.referrer).origin : '';
  } catch (_) {
    return '';
  }
})();
const PARENT_ORIGIN = QUERY_PARENT_ORIGIN || REFERRER_PARENT_ORIGIN || DEFAULT_PARENT_ORIGIN;
const prefersDarkMedia = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
let themeModeObserver = null;
let themeModeSyncedFromParent = false;
let activeTab = 'preset';
let launchpadAppItems = [];
let launchpadIconScaleSelectedKeys = [];
let launchpadPollTimer = null;
let authToken = loadAuthToken();
let authenticated = false;

function loadAuthToken() {
  try {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY) || '';
  } catch (_) {
    return '';
  }
}

function setAuthToken(token) {
  authToken = typeof token === 'string' ? token : '';
  try {
    if (authToken) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, authToken);
    } else {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
    }
  } catch (_) {
    // ignore storage errors
  }
}

function setAuthError(text) {
  if (!authErrorEl) return;
  authErrorEl.textContent = text || '';
}

function setAuthenticated(next) {
  authenticated = Boolean(next);
  if (logoutBtn) {
    logoutBtn.classList.toggle('hidden', !authenticated);
  }
}

function showAuth(mode, hintText = '') {
  if (authScreenEl) authScreenEl.classList.remove('hidden');
  if (appShellEl) appShellEl.classList.add('hidden');
  if (setupFormEl) setupFormEl.classList.toggle('hidden', mode !== 'setup');
  if (loginFormEl) loginFormEl.classList.toggle('hidden', mode !== 'login');
  if (authHintEl) authHintEl.textContent = hintText;
  setAuthError('');
  setAuthenticated(false);

  if (mode === 'setup') {
    if (setupPasswordEl) setupPasswordEl.value = '';
    if (setupPassword2El) setupPassword2El.value = '';
    setupPasswordEl?.focus();
    return;
  }

  if (loginPasswordEl) loginPasswordEl.value = '';
  loginPasswordEl?.focus();
}

function showAppShell() {
  if (authScreenEl) authScreenEl.classList.add('hidden');
  if (appShellEl) appShellEl.classList.remove('hidden');
  setAuthenticated(true);
}

function apiUrl(path) {
  const cleanPath = path.replace(/^\/+/, '');
  return new URL(cleanPath, window.location.href).toString();
}

async function requestJson(path, options = {}) {
  const headers = new Headers(options.headers || {});
  if (authToken && !headers.has('X-Auth-Token')) {
    headers.set('X-Auth-Token', authToken);
  }

  const response = await fetch(apiUrl(path), {
    cache: 'no-store',
    credentials: 'same-origin',
    ...options,
    headers,
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch (_) {
    payload = {};
  }

  if (!response.ok) {
    if (response.status === 401) {
      setAuthToken('');
    }
    const message = payload.error || payload.message || `Request failed: ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
}

function handleUnauthorized(hint = '会话已失效，请重新输入访问密码。') {
  setAuthToken('');
  setMessage('');
  showAuth('login', hint);
}

function setMessage(text, type = '') {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`.trim();
}

function setStatusPillState(pillEl, state) {
  if (!pillEl) return;
  pillEl.classList.remove('is-ok', 'is-pending', 'is-error');
  if (state === 'error') {
    pillEl.classList.add('is-error');
    return;
  }
  if (state === 'pending') {
    pillEl.classList.add('is-pending');
    return;
  }
  pillEl.classList.add('is-ok');
}

function formatTime(iso) {
  if (!iso) return '未知';
  try {
    return new Date(iso).toLocaleString();
  } catch (err) {
    return iso;
  }
}

async function loadStatus() {
  try {
    const data = await requestJson('api/status');
    if (!data.ok) throw new Error(data.message || '状态读取失败');

    const status = data.data;
    const indexStatusText = status.indexExists ? '已找到' : '未找到';
    const backupStatusText = status.backupExists ? '已存在' : '未创建';

    statusIndex.textContent = indexStatusText;
    statusBackup.textContent = backupStatusText;
    if (statusRootPill) {
      statusRootPill.title = 'ROOT权限：已获取';
      statusRootPill.setAttribute('aria-label', 'ROOT权限：已获取');
    }
    if (statusIndexPill) {
      statusIndexPill.title = `目标文件：${indexStatusText}`;
      statusIndexPill.setAttribute('aria-label', `目标文件：${indexStatusText}`);
    }
    if (statusBackupPill) {
      statusBackupPill.title = `备份文件：${backupStatusText}`;
      statusBackupPill.setAttribute('aria-label', `备份文件：${backupStatusText}`);
    }
    setStatusPillState(statusIndexPill, status.indexExists ? 'ok' : 'error');
    setStatusPillState(statusBackupPill, status.backupExists ? 'ok' : 'error');
    statusIndexMeta.textContent = `${status.indexPath} · ${status.indexMtime ? formatTime(status.indexMtime) : '无时间信息'}`;
    statusBackupMeta.textContent = `${status.backupPath} · ${status.backupMtime ? formatTime(status.backupMtime) : '无时间信息'}`;
  } catch (err) {
    if (err && err.status === 401) {
      handleUnauthorized();
      return;
    }
    const errorDetail = err.message || '状态加载失败';
    statusIndex.textContent = `检测失败：${errorDetail}`;
    statusBackup.textContent = `检测失败：${errorDetail}`;
    if (statusRootPill) {
      statusRootPill.title = 'ROOT权限：已获取';
      statusRootPill.setAttribute('aria-label', 'ROOT权限：已获取');
    }
    if (statusIndexPill) {
      statusIndexPill.title = `目标文件：检测失败（${errorDetail}）`;
      statusIndexPill.setAttribute('aria-label', `目标文件：检测失败（${errorDetail}）`);
    }
    if (statusBackupPill) {
      statusBackupPill.title = `备份文件：检测失败（${errorDetail}）`;
      statusBackupPill.setAttribute('aria-label', `备份文件：检测失败（${errorDetail}）`);
    }
    setStatusPillState(statusIndexPill, 'error');
    setStatusPillState(statusBackupPill, 'error');
    setMessage(err.message || '状态加载失败', 'error');
  }
}

function updateModePanels(cardElement, mode) {
  if (!cardElement) return;
  const panels = cardElement.querySelectorAll('.mode-panel');
  panels.forEach((panel) => {
    if (panel.dataset.mode === mode) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}

function getCheckedMode(name) {
  const checked = document.querySelector(`input[name="${name}-mode"]:checked`);
  return checked ? checked.value : 'none';
}

function syncSectionToggle(name) {
  const mode = getCheckedMode(name);
  const enabled = mode !== 'none';

  const toggle = name === 'css' ? cssEnableToggle : jsEnableToggle;
  const overview = name === 'css' ? cssOverview : jsOverview;

  if (toggle) toggle.checked = enabled;
  if (overview) overview.classList.toggle('disabled', !enabled);
}

function setMode(name, mode) {
  const target = document.querySelector(`input[name="${name}-mode"][value="${mode}"]`);
  if (!target) return;
  target.checked = true;
  target.dispatchEvent(new Event('change', { bubbles: true }));
}

function setSectionEnabled(name, enabled) {
  if (enabled) {
    if (getCheckedMode(name) === 'none') {
      setMode(name, 'file');
    } else {
      syncSectionToggle(name);
    }
    return;
  }
  setMode(name, 'none');
}

function wireOverviewDescToggle(name, element) {
  if (!element) return;
  element.addEventListener('click', () => {
    const toggle = name === 'css' ? cssEnableToggle : jsEnableToggle;
    if (!toggle) return;
    toggle.checked = !toggle.checked;
    toggle.dispatchEvent(new Event('change', { bubbles: true }));
  });
}

function normalizeThemeMode(mode) {
  return mode === 'dark' ? 'dark' : '';
}

function applyThemeMode(mode) {
  const normalized = normalizeThemeMode(mode);
  if (document.body) {
    document.body.removeAttribute('theme-mode');
  }
  if (normalized === 'dark') {
    document.documentElement.setAttribute('theme-mode', 'dark');
    return;
  }
  document.documentElement.removeAttribute('theme-mode');
}

function getDirectParentThemeMode() {
  try {
    if (window.parent && window.parent !== window && window.parent.document && window.parent.document.body) {
      return {
        available: true,
        mode: window.parent.document.body.getAttribute('theme-mode'),
      };
    }
  } catch (_) {
    // cross-origin or blocked access
  }
  return { available: false, mode: null };
}

function getFallbackThemeMode() {
  if (prefersDarkMedia && prefersDarkMedia.matches) return 'dark';
  return '';
}

function syncThemeModeFromParent() {
  const direct = getDirectParentThemeMode();
  if (direct.available) {
    themeModeSyncedFromParent = true;
    applyThemeMode(direct.mode);
    return;
  }
  applyThemeMode(getFallbackThemeMode());
}

function onThemeMessage(event) {
  const data = event && event.data;
  if (!data || typeof data !== 'object') return;
  if (event.origin !== PARENT_ORIGIN) return;
  if (window.parent && event.source !== window.parent) return;
  if (data.type !== THEME_MODE_MSG) return;
  themeModeSyncedFromParent = true;
  applyThemeMode(data.themeMode);
}

function requestThemeModeFromParent() {
  if (!window.parent || window.parent === window) return;
  try {
    window.parent.postMessage(
      {
        type: THEME_MODE_REQ_MSG,
        childOrigin: CHILD_ORIGIN,
      },
      PARENT_ORIGIN,
    );
  } catch (_) {
    // ignore
  }
}

function onSystemThemeChanged() {
  if (themeModeSyncedFromParent) return;
  applyThemeMode(getFallbackThemeMode());
}

function observeThemeMode() {
  let sourceBody = null;
  try {
    if (window.parent && window.parent !== window && window.parent.document && window.parent.document.body) {
      sourceBody = window.parent.document.body;
    }
  } catch (_) {
    sourceBody = null;
  }

  if (!sourceBody) {
    sourceBody = document.body;
  }
  if (!sourceBody) return;

  themeModeObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'theme-mode') {
        syncThemeModeFromParent();
        break;
      }
    }
  });

  themeModeObserver.observe(sourceBody, { attributes: true, attributeFilter: ['theme-mode'] });
}

function wireModeGroup(name) {
  const radios = document.querySelectorAll(`input[name="${name}-mode"]`);
  if (!radios || radios.length === 0) return;
  const card = radios[0].closest('.card');
  const current = getCheckedMode(name);
  updateModePanels(card, current);
  syncSectionToggle(name);

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      updateModePanels(card, radio.value);
      syncSectionToggle(name);
    });
  });
}

function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

function fileHint(input, hintEl) {
  const file = input.files && input.files[0];
  if (!file) {
    hintEl.textContent = '未选择文件';
    return;
  }
  const size = (file.size / 1024).toFixed(1);
  hintEl.textContent = `${file.name} · ${size} KB`;
}

function normalizeLaunchpadKeyList(value, maxLength = 320) {
  if (!Array.isArray(value)) return [];
  const unique = new Set();
  value.forEach((item) => {
    if (typeof item !== 'string') return;
    const key = item.trim().slice(0, maxLength);
    if (!key) return;
    unique.add(key);
  });
  return Array.from(unique);
}

function normalizeLaunchpadAppItems(items) {
  if (!Array.isArray(items)) return [];
  const keyMap = new Map();
  items.forEach((item) => {
    if (!item || typeof item !== 'object') return;
    const key = typeof item.key === 'string' ? item.key.trim().slice(0, 320) : '';
    if (!key) return;
    const titleRaw = typeof item.title === 'string' ? item.title.trim().slice(0, 200) : '';
    const title = titleRaw || key.split('/').pop() || key;
    keyMap.set(key, { key, title });
  });
  return Array.from(keyMap.values());
}

function setLaunchpadAppListStatus(text) {
  if (!launchpadAppListStatusEl) return;
  launchpadAppListStatusEl.textContent = text;
}

function renderLaunchpadAppList() {
  if (!launchpadAppListEl) return;

  if (!launchpadAppItems.length) {
    launchpadAppListEl.textContent = '暂无数据';
    return;
  }

  const selectedSet = new Set(launchpadIconScaleSelectedKeys);
  const fragment = document.createDocumentFragment();

  launchpadAppItems.forEach(({ key, title }) => {
    const itemEl = document.createElement('label');
    itemEl.className = 'launchpad-app-item';

    const checkboxEl = document.createElement('input');
    checkboxEl.type = 'checkbox';
    checkboxEl.dataset.launchpadKey = key;
    checkboxEl.checked = selectedSet.has(key);

    const textWrapEl = document.createElement('span');
    textWrapEl.className = 'launchpad-app-text';

    const titleRowEl = document.createElement('span');
    titleRowEl.className = 'launchpad-app-title-row';

    const titleEl = document.createElement('span');
    titleEl.textContent = title;

    titleRowEl.appendChild(titleEl);
    textWrapEl.appendChild(titleRowEl);

    const keyEl = document.createElement('span');
    keyEl.className = 'launchpad-app-key';
    keyEl.textContent = key;
    textWrapEl.appendChild(keyEl);

    itemEl.appendChild(checkboxEl);
    itemEl.appendChild(textWrapEl);
    fragment.appendChild(itemEl);
  });

  launchpadAppListEl.textContent = '';
  launchpadAppListEl.appendChild(fragment);
}

async function loadLaunchpadAppItems() {
  try {
    const payload = await requestJson('api/launchpad/apps');
    if (!payload.ok) {
      throw new Error(payload.message || '启动台应用列表读取失败');
    }

    const report = payload.data || {};
    launchpadAppItems = normalizeLaunchpadAppItems(report.items || []);
    launchpadIconScaleSelectedKeys = normalizeLaunchpadKeyList(launchpadIconScaleSelectedKeys);
    renderLaunchpadAppList();

    if (launchpadAppItems.length > 0) {
      const updatedAtText = report.updatedAt ? `，最近更新：${formatTime(report.updatedAt)}` : '';
      const fromCli = typeof report.source === 'string' && report.source.startsWith('appcenter-cli');
      if (fromCli) {
        setLaunchpadAppListStatus(`应用列表：${launchpadAppItems.length} 项（来自 appcenter-cli 估算，打开启动台后会自动修正）`);
      } else {
        setLaunchpadAppListStatus(`应用列表：${launchpadAppItems.length} 项${updatedAtText}`);
      }
      return;
    }

    setLaunchpadAppListStatus('应用列表：等待启动台页面上报（打开启动台后自动同步）');
  } catch (err) {
    if (err && err.status === 401) {
      handleUnauthorized();
      return;
    }
    setLaunchpadAppListStatus('应用列表：读取失败，稍后自动重试');
  }
}

function ensureLaunchpadPolling() {
  if (launchpadPollTimer) return;
  launchpadPollTimer = window.setInterval(() => {
    if (!authenticated) return;
    if (activeTab !== 'preset') return;
    loadLaunchpadAppItems().catch(() => {});
  }, 3000);
}

async function getPayloadForSection(mode, fileInput, textArea, pathInput, label) {
  if (mode === 'none') {
    return { text: '', path: '' };
  }

  if (mode === 'file') {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
      throw new Error(`${label} 未选择文件`);
    }
    return { text: (await readFileAsText(file)).trim(), path: '' };
  }

  if (mode === 'text') {
    const text = textArea.value.trim();
    if (!text) {
      throw new Error(`${label} 编辑内容为空`);
    }
    return { text, path: '' };
  }

  if (mode === 'path') {
    const pathValue = pathInput.value.trim();
    if (!pathValue) {
      throw new Error(`${label} 路径为空`);
    }
    return { text: '', path: pathValue };
  }

  return { text: '', path: '' };
}

function normalizePresetCustomMode(mode) {
  if (mode === 'none' || mode === 'file' || mode === 'path' || mode === 'text') {
    return mode;
  }
  return 'text';
}

function getPresetCustomMode(name) {
  return normalizePresetCustomMode(getCheckedMode(`preset-${name}`));
}

function setPresetCustomMode(name, mode) {
  const normalized = normalizePresetCustomMode(mode);
  const target = document.querySelector(`input[name="preset-${name}-mode"][value="${normalized}"]`);
  if (!target) return;
  target.checked = true;
}

function updatePresetCustomModePanels(name) {
  const container = name === 'css' ? presetCssSourceEl : presetJsSourceEl;
  if (!container) return;
  updateModePanels(container, getPresetCustomMode(name));
}

function wirePresetCustomModeGroup(name) {
  const radios = document.querySelectorAll(`input[name="preset-${name}-mode"]`);
  if (!radios.length) return;

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      updatePresetCustomModePanels(name);
      savePresetConfig();
    });
  });
}

function hslToRgb(h, s, l) {
  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
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
  let h = 0;

  if (max === rn) {
    h = (gn - bn) / d + (gn < bn ? 6 : 0);
  } else if (max === gn) {
    h = (bn - rn) / d + 2;
  } else {
    h = (rn - gn) / d + 4;
  }

  h /= 6;
  return { h, s, l };
}

function normalizeHex(value) {
  if (typeof value !== 'string') return null;
  const hex = value.trim().toLowerCase();
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(hex)) return null;
  if (hex.length === 4) {
    return `#${hex.slice(1).split('').map((c) => c + c).join('')}`;
  }
  return hex;
}

function rgbToHex({ r, g, b }) {
  return `#${[r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('')}`;
}

function clampBrandLightness(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return DEFAULT_BRAND_COLOR;

  const intValue = Number.parseInt(normalized.slice(1), 16);
  const rgb = {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255,
  };
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const clampedL = Math.min(BRAND_LIGHTNESS_MAX, Math.max(BRAND_LIGHTNESS_MIN, hsl.l));
  return rgbToHex(hslToRgb(hsl.h, hsl.s, clampedL));
}

function getCurrentPresetConfig() {
  const titlebarStyle = styleMacEl && styleMacEl.checked ? 'mac' : 'windows';
  const launchpadStyle = styleSpotlightLaunchpadEl && styleSpotlightLaunchpadEl.checked ? 'spotlight' : 'classic';
  const brandColor = clampBrandLightness(brandColorEl ? brandColorEl.value : DEFAULT_BRAND_COLOR);
  const customCssMode = getPresetCustomMode('css');
  const customJsMode = getPresetCustomMode('js');

  return {
    basePresetEnabled: Boolean(basePresetEnabledEl ? basePresetEnabledEl.checked : true),
    titlebarStyle,
    launchpadStyle,
    launchpadIconScaleEnabled: Boolean(launchpadIconScaleEnabledEl && launchpadIconScaleEnabledEl.checked),
    launchpadIconScaleSelectedKeys: normalizeLaunchpadKeyList(launchpadIconScaleSelectedKeys),
    brandColor,
    fontOverrideEnabled: Boolean(fontOverrideEnabledEl && fontOverrideEnabledEl.checked),
    fontFamily: fontFamilyEl ? fontFamilyEl.value.trim() : '',
    fontUrl: fontUrlEl ? fontUrlEl.value.trim() : '',
    fontWeight: fontWeightEl ? fontWeightEl.value.trim() : '',
    fontFeatureSettings: fontFeatureSettingsEl ? fontFeatureSettingsEl.value.trim() : '',
    customCodeEnabled: Boolean(customCodeEnabledEl && customCodeEnabledEl.checked),
    customCssMode,
    customJsMode,
    customCssPath: presetCssPathInput ? presetCssPathInput.value.trim() : '',
    customJsPath: presetJsPathInput ? presetJsPathInput.value.trim() : '',
    customCss: customCssEl ? customCssEl.value : '',
    customJs: customJsEl ? customJsEl.value : '',
  };
}

function getPresetAssetBaseUrl() {
  const protocol = window.location.protocol || 'http:';
  const hostname = window.location.hostname || '127.0.0.1';
  return `${protocol}//${hostname}:8964`;
}

function updateFontSettingsVisibility() {
  if (!fontSettingsEl || !fontOverrideEnabledEl) return;
  fontSettingsEl.style.display = fontOverrideEnabledEl.checked ? 'grid' : 'none';
}

function updateCustomCodeSettingsVisibility() {
  if (!customCodeSettingsEl || !customCodeEnabledEl) return;
  customCodeSettingsEl.style.display = customCodeEnabledEl.checked ? 'grid' : 'none';
}

function updateBasePresetSettingsVisibility() {
  const enabled = !basePresetEnabledEl || basePresetEnabledEl.checked;
  [colorSettingsEl, platformGroupEl, launchpadGroupEl].forEach((sectionEl) => {
    if (!sectionEl) return;
    sectionEl.style.display = enabled ? '' : 'none';
  });
}

function savePresetConfig() {
  try {
    const config = getCurrentPresetConfig();
    localStorage.setItem(PRESET_STORAGE_KEY, JSON.stringify(config));
  } catch (_) {
    // ignore
  }
}

function setPresetConfig(nextConfig) {
  const merged = { ...DEFAULT_PRESET_CONFIG, ...(nextConfig || {}) };

  const brand = clampBrandLightness(typeof merged.brandColor === 'string' ? merged.brandColor : DEFAULT_BRAND_COLOR);
  if (brandColorEl) brandColorEl.value = brand;
  if (basePresetEnabledEl) basePresetEnabledEl.checked = Boolean(merged.basePresetEnabled);

  if (styleWindowsEl) styleWindowsEl.checked = merged.titlebarStyle !== 'mac';
  if (styleMacEl) styleMacEl.checked = merged.titlebarStyle === 'mac';
  if (styleClassicLaunchpadEl) styleClassicLaunchpadEl.checked = merged.launchpadStyle !== 'spotlight';
  if (styleSpotlightLaunchpadEl) styleSpotlightLaunchpadEl.checked = merged.launchpadStyle === 'spotlight';
  if (launchpadIconScaleEnabledEl) launchpadIconScaleEnabledEl.checked = Boolean(merged.launchpadIconScaleEnabled);
  launchpadIconScaleSelectedKeys = normalizeLaunchpadKeyList(merged.launchpadIconScaleSelectedKeys);

  if (fontOverrideEnabledEl) fontOverrideEnabledEl.checked = Boolean(merged.fontOverrideEnabled);
  if (fontFamilyEl) fontFamilyEl.value = typeof merged.fontFamily === 'string' ? merged.fontFamily : '';
  if (fontUrlEl) fontUrlEl.value = typeof merged.fontUrl === 'string' ? merged.fontUrl : '';
  if (fontWeightEl) fontWeightEl.value = typeof merged.fontWeight === 'string' ? merged.fontWeight : '';
  if (fontFeatureSettingsEl) {
    fontFeatureSettingsEl.value = typeof merged.fontFeatureSettings === 'string' ? merged.fontFeatureSettings : '';
  }

  if (customCodeEnabledEl) customCodeEnabledEl.checked = Boolean(merged.customCodeEnabled);
  setPresetCustomMode('css', merged.customCssMode);
  setPresetCustomMode('js', merged.customJsMode);
  if (presetCssPathInput) presetCssPathInput.value = typeof merged.customCssPath === 'string' ? merged.customCssPath : '';
  if (presetJsPathInput) presetJsPathInput.value = typeof merged.customJsPath === 'string' ? merged.customJsPath : '';
  if (customCssEl) customCssEl.value = typeof merged.customCss === 'string' ? merged.customCss : '';
  if (customJsEl) customJsEl.value = typeof merged.customJs === 'string' ? merged.customJs : '';

  updateFontSettingsVisibility();
  updateCustomCodeSettingsVisibility();
  updateBasePresetSettingsVisibility();
  updatePresetCustomModePanels('css');
  updatePresetCustomModePanels('js');
  renderLaunchpadAppList();
}

function loadPresetConfig() {
  let saved = null;
  try {
    const raw = localStorage.getItem(PRESET_STORAGE_KEY);
    saved = raw ? JSON.parse(raw) : null;
  } catch (_) {
    saved = null;
  }

  setPresetConfig(saved || DEFAULT_PRESET_CONFIG);
}

function setActiveTab(tab) {
  activeTab = tab === 'custom' ? 'custom' : 'preset';

  modeTabs.forEach((tabBtn) => {
    const selected = tabBtn.dataset.tabTarget === activeTab;
    tabBtn.classList.toggle('is-active', selected);
    tabBtn.setAttribute('aria-selected', selected ? 'true' : 'false');
  });

  tabPanels.forEach((panel) => {
    const selected = panel.dataset.tab === activeTab;
    panel.classList.toggle('is-active', selected);
  });

  if (authenticated && activeTab === 'preset') {
    loadLaunchpadAppItems().catch(() => {});
  }
}

async function handleInject() {
  setMessage('');
  injectBtn.disabled = true;
  restoreBtn.disabled = true;

  try {
    const delayRaw = injectDelayInput ? injectDelayInput.value.trim() : '';
    const injectDelaySec = delayRaw ? Number(delayRaw) : DEFAULT_INJECT_DELAY;

    if (!Number.isFinite(injectDelaySec) || injectDelaySec < 0 || injectDelaySec > 120) {
      throw new Error('注入延时无效 (0-120 秒)');
    }

    if (activeTab === 'preset') {
      const presetConfig = getCurrentPresetConfig();
      let cssPath = '';
      let jsPath = '';
      let cssText = '';
      let jsText = '';

      if (presetConfig.customCodeEnabled) {
        const cssMode = normalizePresetCustomMode(presetConfig.customCssMode);
        const jsMode = normalizePresetCustomMode(presetConfig.customJsMode);

        const [cssPayload, jsPayload] = await Promise.all([
          getPayloadForSection(cssMode, presetCssFileInput, customCssEl, presetCssPathInput, '预设 CSS'),
          getPayloadForSection(jsMode, presetJsFileInput, customJsEl, presetJsPathInput, '预设 JavaScript'),
        ]);

        cssText = cssPayload.text || '';
        jsText = jsPayload.text || '';
        cssPath = cssPayload.path || '';
        jsPath = jsPayload.path || '';
      }

      presetConfig.customCss = cssText;
      presetConfig.customJs = jsText;

      const data = await requestJson('api/inject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          injectMode: 'preset',
          presetConfig,
          cssText,
          jsText,
          cssPath,
          jsPath,
          assetBaseUrl: getPresetAssetBaseUrl(),
          injectDelaySec,
        }),
      });
      if (!data.ok) throw new Error(data.message || '注入失败');
      setMessage(data.message || '注入成功', 'ok');
      savePresetConfig();
      await loadStatus();
      return;
    }

    const cssMode = document.querySelector('input[name="css-mode"]:checked').value;
    const jsMode = document.querySelector('input[name="js-mode"]:checked').value;

    if (cssMode === 'none' && jsMode === 'none') {
      throw new Error('请至少选择 CSS 或 JS 之一进行注入');
    }

    const [cssPayload, jsPayload] = await Promise.all([
      getPayloadForSection(cssMode, cssFileInput, cssTextArea, cssPathInput, 'CSS'),
      getPayloadForSection(jsMode, jsFileInput, jsTextArea, jsPathInput, 'JS'),
    ]);

    const data = await requestJson('api/inject', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        injectMode: 'custom',
        cssText: cssPayload.text || '',
        jsText: jsPayload.text || '',
        cssPath: cssPayload.path || '',
        jsPath: jsPayload.path || '',
        injectDelaySec,
      }),
    });
    if (!data.ok) throw new Error(data.message || '注入失败');

    setMessage(data.message || '注入成功', 'ok');
    await loadStatus();
  } catch (err) {
    if (err && err.status === 401) {
      handleUnauthorized();
      return;
    }
    setMessage(err.message || '注入失败', 'error');
  } finally {
    injectBtn.disabled = false;
    restoreBtn.disabled = false;
  }
}

async function handleRestore() {
  setMessage('');
  const confirmed = window.confirm('确认还原到官方默认状态？此操作会覆盖当前注入内容。');
  if (!confirmed) return;

  injectBtn.disabled = true;
  restoreBtn.disabled = true;

  try {
    const data = await requestJson('api/restore', { method: 'POST' });
    if (!data.ok) throw new Error(data.message || '还原失败');
    setMessage(data.message || '还原完成', 'ok');
    await loadStatus();
  } catch (err) {
    if (err && err.status === 401) {
      handleUnauthorized();
      return;
    }
    setMessage(err.message || '还原失败', 'error');
  } finally {
    injectBtn.disabled = false;
    restoreBtn.disabled = false;
  }
}

async function bootstrapAuthenticatedUi() {
  showAppShell();
  setAuthError('');
  await loadStatus();
  if (activeTab === 'preset') {
    await loadLaunchpadAppItems();
  }
  ensureLaunchpadPolling();
}

async function loadAuthState() {
  const state = await requestJson('api/auth/state');
  if (!state.configured) {
    setAuthToken('');
    showAuth('setup', `首次使用请先设置访问密码（至少 ${AUTH_MIN_PASSWORD_LEN} 位）。`);
    return;
  }

  if (!state.authenticated) {
    setAuthToken('');
    showAuth('login', '请输入你之前设置的访问密码。');
    return;
  }

  await bootstrapAuthenticatedUi();
}

setupFormEl?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!setupPasswordEl || !setupPassword2El) return;
  const password = setupPasswordEl.value;
  const password2 = setupPassword2El.value;

  if (password.length < AUTH_MIN_PASSWORD_LEN) {
    setAuthError(`密码长度不能小于 ${AUTH_MIN_PASSWORD_LEN} 位`);
    return;
  }
  if (password !== password2) {
    setAuthError('两次输入密码不一致');
    return;
  }

  try {
    const payload = await requestJson('api/auth/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setAuthToken(payload.authToken || '');
    await bootstrapAuthenticatedUi();
  } catch (error) {
    setAuthError(error.message || '设置密码失败');
  }
});

loginFormEl?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!loginPasswordEl) return;
  const password = loginPasswordEl.value;
  if (!password) {
    setAuthError('请输入访问密码');
    return;
  }

  try {
    const payload = await requestJson('api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    setAuthToken(payload.authToken || '');
    await bootstrapAuthenticatedUi();
  } catch (error) {
    setAuthError(error.message || '登录失败');
  }
});

logoutBtn?.addEventListener('click', async () => {
  try {
    await requestJson('api/auth/logout', { method: 'POST' });
  } catch (_) {
    // logout is best-effort
  }
  handleUnauthorized('已退出登录。请输入访问密码继续。');
});

cssFileInput?.addEventListener('change', () => fileHint(cssFileInput, cssFileHint));
jsFileInput?.addEventListener('change', () => fileHint(jsFileInput, jsFileHint));
presetCssFileInput?.addEventListener('change', () => fileHint(presetCssFileInput, presetCssFileHint));
presetJsFileInput?.addEventListener('change', () => fileHint(presetJsFileInput, presetJsFileHint));

injectBtn.addEventListener('click', handleInject);
restoreBtn.addEventListener('click', handleRestore);
cssEnableToggle?.addEventListener('change', () => setSectionEnabled('css', cssEnableToggle.checked));
jsEnableToggle?.addEventListener('change', () => setSectionEnabled('js', jsEnableToggle.checked));
wireOverviewDescToggle('css', cssOverviewDesc);
wireOverviewDescToggle('js', jsOverviewDesc);

presetTabBtn?.addEventListener('click', () => setActiveTab('preset'));
customTabBtn?.addEventListener('click', () => setActiveTab('custom'));

fontOverrideEnabledEl?.addEventListener('change', () => {
  updateFontSettingsVisibility();
  savePresetConfig();
});
customCodeEnabledEl?.addEventListener('change', () => {
  updateCustomCodeSettingsVisibility();
  savePresetConfig();
});
basePresetEnabledEl?.addEventListener('change', () => {
  updateBasePresetSettingsVisibility();
  savePresetConfig();
});
launchpadIconScaleEnabledEl?.addEventListener('change', savePresetConfig);

launchpadAppListEl?.addEventListener('change', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;
  if (target.type !== 'checkbox') return;
  const key = typeof target.dataset.launchpadKey === 'string' ? target.dataset.launchpadKey.trim() : '';
  if (!key) return;

  const selectedSet = new Set(launchpadIconScaleSelectedKeys);
  if (target.checked) {
    selectedSet.add(key);
  } else {
    selectedSet.delete(key);
  }
  launchpadIconScaleSelectedKeys = Array.from(selectedSet);
  savePresetConfig();
});

resetBrandColorEl?.addEventListener('click', () => {
  if (!brandColorEl) return;
  brandColorEl.value = DEFAULT_BRAND_COLOR;
  savePresetConfig();
});

[
  brandColorEl,
  styleWindowsEl,
  styleMacEl,
  styleClassicLaunchpadEl,
  styleSpotlightLaunchpadEl,
  fontFamilyEl,
  fontUrlEl,
  fontWeightEl,
  fontFeatureSettingsEl,
  customCssEl,
  customJsEl,
  presetCssPathInput,
  presetJsPathInput,
].forEach((el) => {
  el?.addEventListener('change', savePresetConfig);
  el?.addEventListener('blur', savePresetConfig);
});

window.addEventListener('message', onThemeMessage);
window.addEventListener('focus', requestThemeModeFromParent);
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    requestThemeModeFromParent();
  }
});
if (prefersDarkMedia) {
  if (typeof prefersDarkMedia.addEventListener === 'function') {
    prefersDarkMedia.addEventListener('change', onSystemThemeChanged);
  } else if (typeof prefersDarkMedia.addListener === 'function') {
    prefersDarkMedia.addListener(onSystemThemeChanged);
  }
}

syncThemeModeFromParent();
observeThemeMode();
requestThemeModeFromParent();

wireModeGroup('css');
wireModeGroup('js');
wirePresetCustomModeGroup('css');
wirePresetCustomModeGroup('js');
loadPresetConfig();
setActiveTab('preset');
ensureLaunchpadPolling();
loadAuthState().catch((error) => {
  showAuth('login', '无法获取鉴权状态，请稍后重试。');
  setAuthError(error.message || '鉴权状态读取失败');
});
