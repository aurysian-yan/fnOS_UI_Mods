(() => {
  if (window.top !== window) return;

  const ORIGIN = location.origin;
  const BASIC_STYLE_ID = 'fnos-ui-mods-basic-style';
  const TITLEBAR_STYLE_ID = 'fnos-ui-mods-titlebar-style';
  const SCRIPT_ID = 'fnos-ui-mods-script';
  const THEME_STYLE_ID = 'fnos-ui-mods-theme-style';
  const THEME_DEFAULT_BRAND = '#0066ff';
  const BRAND_LIGHTNESS_MIN = 0.2;
  const BRAND_LIGHTNESS_MAX = 0.8;
  let currentBrandColor = THEME_DEFAULT_BRAND;
  const TITLEBAR_STYLES = {
    windows: 'windows_titlebar_mod.css',
    mac: 'mac_titlebar_mod.css'
  };

  function clamp255(value) {
    return Math.max(0, Math.min(255, Math.round(value)));
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
      b: clampChannel(b * 255)
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

  function clampBrandLightness(hex) {
    const normalized = normalizeHex(hex);
    if (!normalized) return THEME_DEFAULT_BRAND;
    const intValue = parseInt(normalized.slice(1), 16);
    const rgb = {
      r: (intValue >> 16) & 255,
      g: (intValue >> 8) & 255,
      b: intValue & 255
    };
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    const clampedL = Math.min(
      BRAND_LIGHTNESS_MAX,
      Math.max(BRAND_LIGHTNESS_MIN, hsl.l)
    );
    const nextRgb = hslToRgb(hsl.h, hsl.s, clampedL);
    return rgbToHex(nextRgb);
  }

  function hexToRgb(hex) {
    if (typeof hex !== 'string') return null;
    const match = hex.trim().toLowerCase().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/);
    if (!match) return null;
    let value = match[1];
    if (value.length === 3) {
      value = value
        .split('')
        .map((char) => char + char)
        .join('');
    }
    const intValue = parseInt(value, 16);
    return {
      r: (intValue >> 16) & 255,
      g: (intValue >> 8) & 255,
      b: intValue & 255
    };
  }

  function formatRgb(rgb) {
    return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
  }

  function mixWithBlack(rgb, factor) {
    return {
      r: clamp255(rgb.r * factor),
      g: clamp255(rgb.g * factor),
      b: clamp255(rgb.b * factor)
    };
  }

  function mixWithWhite(rgb, mix) {
    const keep = 1 - mix;
    return {
      r: clamp255(rgb.r * keep + 255 * mix),
      g: clamp255(rgb.g * keep + 255 * mix),
      b: clamp255(rgb.b * keep + 255 * mix)
    };
  }

  function generateBrandPalette(brandColor) {
    const base =
      hexToRgb(normalizeHex(brandColor)) || hexToRgb(THEME_DEFAULT_BRAND);
    const darkFactors = [0.4, 0.55, 0.7, 0.85, 1];
    const lightMix = [0.2, 0.4, 0.6, 0.8, 0.92];
    const palette = [];

    for (let i = 0; i < darkFactors.length; i += 1) {
      palette.push(formatRgb(mixWithBlack(base, darkFactors[i])));
    }

    for (let i = 0; i < lightMix.length; i += 1) {
      palette.push(formatRgb(mixWithWhite(base, lightMix[i])));
    }

    return palette;
  }

  function getThemeStyleElement() {
    let style = document.getElementById(THEME_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = THEME_STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    return style;
  }

  function buildThemeCss(palette) {
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

  function applyBrandPaletteInline(target, palette) {
    if (!target) return;
    for (let i = 0; i < palette.length; i += 1) {
      target.style.setProperty(`--semi-brand-${i}`, palette[i], 'important');
    }
  }

  function applyBrandPalette(brandColor) {
    const root = document.documentElement;
    if (!root) return;

    const palette = generateBrandPalette(brandColor);
    const style = getThemeStyleElement();
    style.textContent = buildThemeCss(palette);

    applyBrandPaletteInline(root, palette);
    applyBrandPaletteInline(document.body, palette);
    applyBrandPaletteInline(document.getElementById('root'), palette);
  }

  function updateBrandColor(nextColor) {
    const normalized = normalizeHex(nextColor) || THEME_DEFAULT_BRAND;
    currentBrandColor = clampBrandLightness(normalized);
    applyBrandPalette(currentBrandColor);
  }

  function injectStyle(id, href) {
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      (document.head || document.documentElement).appendChild(link);
    }

    const nextHref = chrome.runtime.getURL(href);
    if (link.href !== nextHref) {
      link.href = nextHref;
    }
  }

  function injectStyles(titlebarStyle) {
    const normalizedStyle = titlebarStyle === 'mac' ? 'mac' : 'windows';
    injectStyle(BASIC_STYLE_ID, 'basic_mod.css');
    injectStyle(TITLEBAR_STYLE_ID, TITLEBAR_STYLES[normalizedStyle]);
  }

  function injectScript() {
    if (document.getElementById(SCRIPT_ID)) return;

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = chrome.runtime.getURL('mod.js');
    script.type = 'text/javascript';
    (document.head || document.documentElement).appendChild(script);
  }

  function startInject(titlebarStyle, brandColor) {
    injectStyles(titlebarStyle);
    updateBrandColor(brandColor);
    injectScript();
  }

  function hasAllClasses(element, classes) {
    return classes.every((name) => element.classList.contains(name));
  }

  function findDirectChildByClasses(parent, classes) {
    for (const child of parent.children) {
      if (hasAllClasses(child, classes)) return child;
    }
    return null;
  }

  function hasFnOSSignature() {
    const body = document.body;
    if (!body) return false;

    const root = Array.from(body.children).find((el) => el.id === 'root');
    if (!root) return false;

    const rootContainer = findDirectChildByClasses(root, ['flex', 'h-screen', 'w-full', 'relative']);
    if (!rootContainer) return false;

    const backgroundContainer = rootContainer.querySelector(':scope > div.absolute.inset-0.z-0.object-contain');
    if (!backgroundContainer) return false;

    return Boolean(backgroundContainer.querySelector('.semi-image'));
  }

  function waitForFnOSSignature(timeoutMs = 3000) {
    if (hasFnOSSignature()) return Promise.resolve(true);

    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        if (!hasFnOSSignature()) return;

        observer.disconnect();
        resolve(true);
      });

      const onTimeout = () => {
        observer.disconnect();
        resolve(false);
      };

      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });

      setTimeout(onTimeout, timeoutMs);
    });
  }

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'FNOS_APPLY') {
      startInject(message.titlebarStyle, message.brandColor ?? currentBrandColor);
      sendResponse({ applied: true });
      return;
    }

    if (message?.type !== 'FNOS_CHECK') return;

    if (!message.wait) {
      sendResponse({ isFnOSWebUi: hasFnOSSignature() });
      return;
    }

    waitForFnOSSignature(1500).then((isFnOSWebUi) => {
      sendResponse({ isFnOSWebUi });
    });

    return true;
  });

  chrome.storage.sync.get(
    {
      enabledOrigins: [],
      autoEnableSuspectedFnOS: true,
      titlebarStyle: 'windows',
      brandColor: THEME_DEFAULT_BRAND
    },
    async ({ enabledOrigins, autoEnableSuspectedFnOS, titlebarStyle, brandColor }) => {
      const isWhitelisted = Array.isArray(enabledOrigins) && enabledOrigins.includes(ORIGIN);
      const matchesFnOSUi = await waitForFnOSSignature();
      const autoEnabled = autoEnableSuspectedFnOS && matchesFnOSUi;

      if (isWhitelisted || autoEnabled) {
        startInject(titlebarStyle, brandColor);
      }
    }
  );

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== 'sync') return;
    if (!changes.brandColor) return;
    updateBrandColor(changes.brandColor.newValue);
  });
})();
