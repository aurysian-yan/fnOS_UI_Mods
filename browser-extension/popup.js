(async () => {
  const originEl = document.getElementById('origin');
  const siteToggleEl = document.getElementById('siteToggle');
  const autoPrivateEl = document.getElementById('autoPrivate');

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const pageUrl = tab?.url ? new URL(tab.url) : null;
  const origin = pageUrl?.origin;

  if (!origin || !/^https?:$/.test(pageUrl.protocol)) {
    originEl.textContent = '当前页不是 http/https 页面';
    siteToggleEl.disabled = true;
    autoPrivateEl.disabled = true;
    return;
  }

  originEl.textContent = origin;

  const state = await chrome.storage.sync.get({
    enabledOrigins: [],
    autoEnablePrivateIp: true
  });

  let enabledOrigins = Array.isArray(state.enabledOrigins) ? state.enabledOrigins : [];
  siteToggleEl.checked = enabledOrigins.includes(origin);
  autoPrivateEl.checked = Boolean(state.autoEnablePrivateIp);

  siteToggleEl.addEventListener('change', async () => {
    const enabled = siteToggleEl.checked;

    if (enabled) {
      enabledOrigins = [...new Set([...enabledOrigins, origin])];
    } else {
      enabledOrigins = enabledOrigins.filter((item) => item !== origin);
    }

    await chrome.storage.sync.set({ enabledOrigins });
  });

  autoPrivateEl.addEventListener('change', async () => {
    await chrome.storage.sync.set({ autoEnablePrivateIp: autoPrivateEl.checked });
  });
})();
