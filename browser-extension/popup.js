(async () => {
  const versionEl = document.querySelector("code.version");
  const originEl = document.getElementById("origin");
  const siteToggleEl = document.getElementById("siteToggle");
  const autoSuspectedFnOSEl = document.getElementById("autoSuspectedFnOS");
  const styleWindowsEl = document.getElementById("styleWindows");
  const styleMacEl = document.getElementById("styleMac");
  const platformGroupEl = document.getElementById("platformGroup");
  const brandColorEl = document.getElementById("brandColor");
  const brandColorTextEl = document.getElementById("brandColorText");
  const firstCardEl = document.querySelector(".card");
  const manifestVersion = chrome.runtime.getManifest().version;
  const externalLinkEls = document.querySelectorAll(
    'a[href^="http://"], a[href^="https://"]'
  );
  const DEFAULT_BRAND_COLOR = "#0066ff";
  const BRAND_LIGHTNESS_MIN = 0.2;
  const BRAND_LIGHTNESS_MAX = 0.8;
  let brandColor = DEFAULT_BRAND_COLOR;
  let lastSavedBrandColor = null;

  if (versionEl) {
    versionEl.textContent = `版本 ${manifestVersion}`;
  }

  for (const linkEl of externalLinkEls) {
    linkEl.addEventListener("click", async (event) => {
      event.preventDefault();
      const href = linkEl.getAttribute("href");
      if (!href) return;

      try {
        await chrome.tabs.create({ url: href });
      } catch (_error) {
        window.open(href, "_blank", "noopener,noreferrer");
      }
    });
  }

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const pageUrl = tab?.url ? new URL(tab.url) : null;
  const origin = pageUrl?.origin;
  let isFnOSWebUi = false;

  function updatePlatformOptionsVisibility() {
    const hasAnyInjectionOptionOn =
      siteToggleEl.checked || autoSuspectedFnOSEl.checked;
    platformGroupEl.style.display = hasAnyInjectionOptionOn ? "block" : "none";
  }

  function setFnUICheckedStatus(isChecked) {
    firstCardEl?.classList.toggle("fnUIChecked", isChecked);
  }

  function syncSwitchAccent(color) {
    document.documentElement.style.setProperty("--switch-on", color);
  }

  async function safeSyncSet(data) {
    try {
      await chrome.storage.sync.set(data);
      return true;
    } catch (error) {
      if (typeof error?.message === "string") {
        console.warn("[FnOS UI Mods] 同步存储写入失败:", error.message);
      }
      return false;
    }
  }

  async function applyToCurrentTabIfNeeded() {
    const shouldInject =
      siteToggleEl.checked || (autoSuspectedFnOSEl.checked && isFnOSWebUi);
    if (!shouldInject) return;

    const style = styleMacEl.checked ? "mac" : "windows";
    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: "FNOS_APPLY",
        titlebarStyle: style,
        brandColor,
      });
    } catch (_error) {
      // ignore; content script may be unavailable for non-http(s) pages
    }
  }

  if (!origin || !/^https?:$/.test(pageUrl.protocol)) {
    originEl.textContent = "当前页不是 http/https 页面";
    siteToggleEl.disabled = true;
    autoSuspectedFnOSEl.disabled = true;
    styleWindowsEl.disabled = true;
    styleMacEl.disabled = true;
    setFnUICheckedStatus(false);
    updatePlatformOptionsVisibility();
    return;
  }

  originEl.textContent = origin;

  try {
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: "FNOS_CHECK",
      wait: true,
    });
    isFnOSWebUi = Boolean(response?.isFnOSWebUi);
    setFnUICheckedStatus(isFnOSWebUi);
  } catch (_error) {
    isFnOSWebUi = false;
    setFnUICheckedStatus(false);
  }

  const state = await chrome.storage.sync.get({
    enabledOrigins: [],
    autoEnableSuspectedFnOS: true,
    titlebarStyle: "windows",
    brandColor: DEFAULT_BRAND_COLOR,
  });

  let enabledOrigins = Array.isArray(state.enabledOrigins)
    ? state.enabledOrigins
    : [];
  brandColor =
    typeof state.brandColor === "string" ? state.brandColor : DEFAULT_BRAND_COLOR;
  brandColor = clampBrandLightness(brandColor);
  lastSavedBrandColor =
    normalizeHex(
      typeof state.brandColor === "string" ? state.brandColor : DEFAULT_BRAND_COLOR
    ) || DEFAULT_BRAND_COLOR;
  if (brandColor !== lastSavedBrandColor) {
    await saveBrandColor(brandColor);
  }
  siteToggleEl.checked = enabledOrigins.includes(origin);
  autoSuspectedFnOSEl.checked = Boolean(state.autoEnableSuspectedFnOS);

  const titlebarStyle = state.titlebarStyle === "mac" ? "mac" : "windows";
  styleWindowsEl.checked = titlebarStyle === "windows";
  styleMacEl.checked = titlebarStyle === "mac";

  setBrandColorUI(brandColor);

  updatePlatformOptionsVisibility();

  siteToggleEl.addEventListener("change", async () => {
    const enabled = siteToggleEl.checked;

    if (enabled) {
      enabledOrigins = [...new Set([...enabledOrigins, origin])];
    } else {
      enabledOrigins = enabledOrigins.filter((item) => item !== origin);
    }

    await safeSyncSet({ enabledOrigins });
    updatePlatformOptionsVisibility();
    await applyToCurrentTabIfNeeded();
  });

  autoSuspectedFnOSEl.addEventListener("change", async () => {
    await safeSyncSet({
      autoEnableSuspectedFnOS: autoSuspectedFnOSEl.checked,
    });
    updatePlatformOptionsVisibility();
    await applyToCurrentTabIfNeeded();
  });

  for (const radio of [styleWindowsEl, styleMacEl]) {
    radio.addEventListener("change", async () => {
      if (!radio.checked) return;
      await safeSyncSet({ titlebarStyle: radio.value });
      await applyToCurrentTabIfNeeded();
    });
  }

  function normalizeHex(value) {
    if (typeof value !== "string") return null;
    const hex = value.trim().toLowerCase();
    if (!/^#[0-9a-f]{6}$/.test(hex)) return null;
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
      const value = clampChannel(l * 255);
      return { r: value, g: value, b: value };
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hue2rgb(p, q, h + 1 / 3);
    const g = hue2rgb(p, q, h);
    const b = hue2rgb(p, q, h - 1 / 3);
    return {
      r: clampChannel(r * 255),
      g: clampChannel(g * 255),
      b: clampChannel(b * 255),
    };
  }

  function rgbToHex({ r, g, b }) {
    return (
      "#" +
      [r, g, b]
        .map((value) => value.toString(16).padStart(2, "0"))
        .join("")
    );
  }

  function clampBrandLightness(hex) {
    const normalized = normalizeHex(hex);
    if (!normalized) return DEFAULT_BRAND_COLOR;
    const intValue = parseInt(normalized.slice(1), 16);
    const rgb = {
      r: (intValue >> 16) & 255,
      g: (intValue >> 8) & 255,
      b: intValue & 255,
    };
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const clampedL = Math.min(
      BRAND_LIGHTNESS_MAX,
      Math.max(BRAND_LIGHTNESS_MIN, hsl.l)
    );
    const nextRgb = hslToRgb(hsl.h, hsl.s, clampedL);
    return rgbToHex(nextRgb);
  }

  function setBrandColorUI(next) {
    if (brandColorEl) {
      brandColorEl.value = next;
    }
    if (brandColorTextEl) {
      brandColorTextEl.value = next;
    }
    syncSwitchAccent(next);
  }

  async function saveBrandColor(next) {
    if (next === lastSavedBrandColor) return true;
    const ok = await safeSyncSet({ brandColor: next });
    if (ok) {
      lastSavedBrandColor = next;
    }
    return ok;
  }

  async function applyBrandColor(next, persist) {
    const normalized = normalizeHex(next) || DEFAULT_BRAND_COLOR;
    const clamped = clampBrandLightness(normalized);
    brandColor = clamped;
    setBrandColorUI(clamped);
    if (persist) {
      await saveBrandColor(clamped);
    }
    await applyToCurrentTabIfNeeded();
  }

  if (brandColorEl) {
    const handlePickerInput = async () => {
      await applyBrandColor(brandColorEl.value, false);
    };
    const handlePickerCommit = async () => {
      await applyBrandColor(brandColorEl.value, true);
    };

    brandColorEl.addEventListener("input", handlePickerInput);
    brandColorEl.addEventListener("change", handlePickerCommit);
  }

  if (brandColorTextEl) {
    const handleTextCommit = async () => {
      await applyBrandColor(brandColorTextEl.value, true);
    };
    brandColorTextEl.addEventListener("change", handleTextCommit);
    brandColorTextEl.addEventListener("blur", handleTextCommit);
    brandColorTextEl.addEventListener("keydown", async (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        await handleTextCommit();
      }
    });
  }
})();
