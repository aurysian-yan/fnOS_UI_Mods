const messageEl = document.getElementById('message');
const injectBtn = document.getElementById('inject-btn');
const restoreBtn = document.getElementById('restore-btn');

const statusIndex = document.getElementById('status-index');
const statusBackup = document.getElementById('status-backup');
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
const DEFAULT_INJECT_DELAY = 5;

function apiUrl(path) {
  const cleanPath = path.replace(/^\/+/, '');
  return new URL(cleanPath, window.location.href).toString();
}

function setMessage(text, type = '') {
  messageEl.textContent = text;
  messageEl.className = `message ${type}`.trim();
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
    const res = await fetch(apiUrl('api/status'));
    const data = await res.json();
    if (!data.ok) throw new Error(data.message || '状态读取失败');

    const status = data.data;
    statusIndex.textContent = status.indexExists ? '已找到' : '未找到';
    statusBackup.textContent = status.backupExists ? '已存在' : '未创建';
    statusIndexMeta.textContent = `${status.indexPath} · ${status.indexMtime ? formatTime(status.indexMtime) : '无时间信息'}`;
    statusBackupMeta.textContent = `${status.backupPath} · ${status.backupMtime ? formatTime(status.backupMtime) : '无时间信息'}`;
  } catch (err) {
    setMessage(err.message || '状态加载失败', 'error');
  }
}

function updateModePanels(cardElement, mode) {
  const panels = cardElement.querySelectorAll('.mode-panel');
  panels.forEach((panel) => {
    if (panel.dataset.mode === mode) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}

function wireModeGroup(name) {
  const radios = document.querySelectorAll(`input[name="${name}-mode"]`);
  const card = radios[0].closest('.card');
  const current = document.querySelector(`input[name="${name}-mode"]:checked`).value;
  updateModePanels(card, current);

  radios.forEach((radio) => {
    radio.addEventListener('change', () => {
      updateModePanels(card, radio.value);
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

async function handleInject() {
  setMessage('');
  injectBtn.disabled = true;
  restoreBtn.disabled = true;

  try {
    const cssMode = document.querySelector('input[name="css-mode"]:checked').value;
    const jsMode = document.querySelector('input[name="js-mode"]:checked').value;

    if (cssMode === 'none' && jsMode === 'none') {
      throw new Error('请至少选择 CSS 或 JS 之一进行注入');
    }

    const [cssPayload, jsPayload] = await Promise.all([
      getPayloadForSection(cssMode, cssFileInput, cssTextArea, cssPathInput, 'CSS'),
      getPayloadForSection(jsMode, jsFileInput, jsTextArea, jsPathInput, 'JS'),
    ]);

    const delayRaw = injectDelayInput ? injectDelayInput.value.trim() : '';
    const injectDelaySec = delayRaw ? Number(delayRaw) : DEFAULT_INJECT_DELAY;

    if (!Number.isFinite(injectDelaySec) || injectDelaySec < 0 || injectDelaySec > 120) {
      throw new Error('注入延时无效 (0-120 秒)');
    }

    console.log('[FnOS UI Mods] inject payload', {
      cssMode,
      jsMode,
      cssTextLength: cssPayload.text ? cssPayload.text.length : 0,
      jsTextLength: jsPayload.text ? jsPayload.text.length : 0,
      cssPath: cssPayload.path || '',
      jsPath: jsPayload.path || '',
      injectDelaySec,
    });

    const res = await fetch(apiUrl('api/inject'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cssText: cssPayload.text || '',
        jsText: jsPayload.text || '',
        cssPath: cssPayload.path || '',
        jsPath: jsPayload.path || '',
        injectDelaySec,
      }),
    });

    const data = await res.json();
    console.log('[FnOS UI Mods] inject response', data);
    if (!data.ok) throw new Error(data.message || '注入失败');

    setMessage(data.message || '注入成功', 'ok');
    await loadStatus();
  } catch (err) {
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
    const res = await fetch(apiUrl('api/restore'), { method: 'POST' });
    const data = await res.json();
    if (!data.ok) throw new Error(data.message || '还原失败');
    setMessage(data.message || '还原完成', 'ok');
    await loadStatus();
  } catch (err) {
    setMessage(err.message || '还原失败', 'error');
  } finally {
    injectBtn.disabled = false;
    restoreBtn.disabled = false;
  }
}

cssFileInput.addEventListener('change', () => fileHint(cssFileInput, cssFileHint));
jsFileInput.addEventListener('change', () => fileHint(jsFileInput, jsFileHint));

injectBtn.addEventListener('click', handleInject);
restoreBtn.addEventListener('click', handleRestore);

wireModeGroup('css');
wireModeGroup('js');
loadStatus();
