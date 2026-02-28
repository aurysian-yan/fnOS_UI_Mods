(() => {
  if (window.top !== window) return;

  const ORIGIN = location.origin;
  const WEB_VERSION_ALLOWED_ORIGINS = new Set([
    'https://fn.mods.aurysian.top'
  ]);
  const WEB_VERSION_REQUEST_TYPE = 'FNOS_UI_MODS_REQUEST_VERSION';
  const WEB_VERSION_RESPONSE_TYPE = 'FNOS_UI_MODS_VERSION_RESPONSE';
  const BASIC_STYLE_ID = 'fnos-ui-mods-basic-style';
  const LOCKSCREEN_STYLE_ID = 'fnos-ui-mods-lockscreen-style';
  const TITLEBAR_STYLE_ID = 'fnos-ui-mods-titlebar-style';
  const LAUNCHPAD_STYLE_ID = 'fnos-ui-mods-launchpad-style';
  const SCRIPT_ID = 'fnos-ui-mods-script';
  const THEME_STYLE_ID = 'fnos-ui-mods-theme-style';
  const FONT_STYLE_ID = 'fnos-ui-mods-font-style';
  const CUSTOM_CSS_STYLE_ID = 'fnos-ui-mods-custom-css-style';
  const CUSTOM_JS_SCRIPT_ID = 'fnos-ui-mods-custom-js-script';
  const DESKTOP_ICON_LAYOUT_STYLE_ID = 'fnos-ui-mods-desktop-icon-layout-style';
  const DESKTOP_ICON_MOD_STYLE_ID = 'fnos-ui-mods-desktop-icon-mod-style';
  const LAUNCHPAD_ICON_SCALE_STYLE_ID = 'fnos-ui-mods-launchpad-icon-scale-style';
  const WINDOW_ANIMATION_BLUR_DISABLED_CLASS =
    'fnos-window-animation-blur-disabled';
  const LAUNCHPAD_ICON_ORIGINAL_SRC_ATTR = 'data-fnos-original-src';
  const LAUNCHPAD_ICON_ORIGINAL_DATA_SRC_ATTR = 'data-fnos-original-data-src';

  const THEME_DEFAULT_BRAND = '#0066ff';
  const BRAND_LIGHTNESS_MIN = 0.3;
  const BRAND_LIGHTNESS_MAX = 0.7;
  const DESKTOP_ICON_LAYOUT_MODE_DEFAULT = 'adaptive';
  const DESKTOP_ICON_PER_COLUMN_DEFAULT = 8;
  const DESKTOP_ICON_PER_COLUMN_MIN = 4;
  const DESKTOP_ICON_PER_COLUMN_MAX = 16;

  const FONT_LOCAL_DATA_KEY = 'customFontDataUrl';
  const FONT_LOCAL_NAME_KEY = 'customFontFileName';
  const FONT_LOCAL_FORMAT_KEY = 'customFontFormat';
  const LOGIN_WALLPAPER_LOCAL_DATA_KEY = 'loginWallpaperDataUrl';
  const LOGIN_WALLPAPER_LOCAL_NAME_KEY = 'loginWallpaperFileName';
  const LOGIN_WALLPAPER_GRADIENT =
    'linear-gradient(120deg, rgba(8, 14, 28, 0.35), rgba(8, 14, 28, 0.18))';
  const LOCKSCREEN_TEXT_AVATAR_CLASS = 'fnos-lockscreen-text-avatar';
  const LOCKSCREEN_TEXT_AVATAR_BOUND_ATTR = 'data-fnos-avatar-bound';
  const LOCKSCREEN_DEFAULT_USERNAME_MAX = 80;
  const LOCKSCREEN_DEFAULT_USERNAME_ROW_CLASS =
    'fnos-lockscreen-default-username-row';
  const LOCKSCREEN_DEFAULT_USERNAME_TEXT_CLASS =
    'fnos-lockscreen-default-username-text';
  const LOCKSCREEN_SWITCH_ACCOUNT_BUTTON_CLASS =
    'fnos-lockscreen-switch-account';
  const LOCKSCREEN_SWITCH_ACCOUNT_ICON_CLASS =
    'fnos-lockscreen-switch-account-icon';
  const LOCKSCREEN_SWITCH_ACCOUNT_LABEL_CLASS =
    'fnos-lockscreen-switch-account-label';
  const LOCKSCREEN_DEFAULT_USERNAME_FIELD_HIDDEN_ATTR =
    'data-fnos-default-username-hidden';
  const LOCKSCREEN_DEFAULT_USERNAME_FIELD_DISPLAY_ATTR =
    'data-fnos-default-username-inline-display';
  const LOCKSCREEN_DEFAULT_USERNAME_SWITCH_BOUND_ATTR =
    'data-fnos-switch-account-bound';
  const LOCKSCREEN_MANUAL_ACCOUNT_MODE_ATTR = 'data-fnos-manual-account-mode';
  const LOCKSCREEN_PINYIN_BOUNDARIES = [
    '\u963f',
    '\u516b',
    '\u5693',
    '\u642d',
    '\u86fe',
    '\u53d1',
    '\u65ee',
    '\u54c8',
    '\u51fb',
    '\u5580',
    '\u5783',
    '\u5988',
    '\u62ff',
    '\u5662',
    '\u556a',
    '\u671f',
    '\u7136',
    '\u6492',
    '\u584c',
    '\u6316',
    '\u6614',
    '\u538b',
    '\u531d'
  ];
  const LOCKSCREEN_PINYIN_INITIALS = 'ABCDEFGHJKLMNOPQRSTWXYZ';
  const LOCKSCREEN_PINYIN_COLLATOR = new Intl.Collator(
    'zh-Hans-u-co-pinyin',
    { sensitivity: 'base', usage: 'sort' }
  );
  const CUSTOM_CSS_LOCAL_KEY = 'customCssCode';
  const CUSTOM_JS_LOCAL_KEY = 'customJsCode';
  const FONT_DEFAULT_FACE_NAME = 'FnOSCustomFont';
  const FONT_DEFAULT_SETTINGS = {
    enabled: false,
    family: '',
    weight: '',
    featureSettings: '',
    faceName: FONT_DEFAULT_FACE_NAME,
    url: ''
  };
  const CUSTOM_CODE_DEFAULT_SETTINGS = {
    enabled: false,
    css: '',
    js: ''
  };
  const LAUNCHPAD_DESKTOP_ICON_CARD_CLASS_TOKENS = [
    'flex',
    'h-[124px]',
    'w-[130px]',
    'cursor-pointer',
    'flex-col',
    'items-center',
    'justify-center',
    'gap-4'
  ];
  const LAUNCHPAD_PANEL_ICON_CARD_CLASS_TOKENS = [
    'flex',
    'flex-col',
    'justify-center',
    'items-center',
    'w-[172px]',
    'h-[156px]',
    'cursor-pointer'
  ];
  const LAUNCHPAD_ICON_BOX_CLASS_TOKENS = [
    'box-border',
    'size-[80px]',
    'p-[15%]'
  ];
  const LAUNCHPAD_ICON_BASE_CLASS = 'fnos-launchpad-icon-box--processed';
  const LAUNCHPAD_ICON_BOX_CLASS = 'fnos-launchpad-icon-box--scaled';
  const LAUNCHPAD_ICON_MASK_ONLY_CLASS = 'fnos-launchpad-icon-box--mask-only';
  const LAUNCHPAD_ICON_BLUR_CLONE_CLASS = 'fnos-launchpad-icon-blur-clone';
  const LAUNCHPAD_ICON_BLUR_CLONE_IMG_CLASS = 'fnos-launchpad-icon-blur-clone-img';
  const LAUNCHPAD_ICON_SRC_PREFIXES = [
    '/static/app/icons/',
    '/app-center-static/serviceicon/'
  ];
  const DESKTOP_ICON_GRID_SELECTOR =
    '.box-border.flex.size-full.flex-col.flex-wrap.place-content-start.items-start.py-base-loose:has(.flex.h-\\[124px\\].w-\\[130px\\].cursor-pointer.flex-col.items-center.justify-center.gap-4)';
  const DESKTOP_ICON_CARD_SELECTOR =
    '.flex.h-\\[124px\\].w-\\[130px\\].cursor-pointer.flex-col.items-center.justify-center.gap-4';

  let currentBrandColor = THEME_DEFAULT_BRAND;
  let currentBasePresetEnabled = true;
  let currentWindowAnimationBlurEnabled = true;
  let currentTitlebarStyle = 'windows';
  let currentLaunchpadStyle = 'classic';
  let currentDesktopIconLayoutEnabled = true;
  let currentDesktopIconLayoutMode = DESKTOP_ICON_LAYOUT_MODE_DEFAULT;
  let currentDesktopIconPerColumn = DESKTOP_ICON_PER_COLUMN_DEFAULT;
  let currentFontSettings = { ...FONT_DEFAULT_SETTINGS };
  let currentCustomCodeSettings = { ...CUSTOM_CODE_DEFAULT_SETTINGS };
  let currentLaunchpadIconScaleEnabled = false;
  let currentLaunchpadIconScaleSelectedKeys = [];
  let currentLaunchpadIconMaskOnlyKeys = [];
  let currentLaunchpadIconRedrawKeys = [];
  let currentLaunchpadIconRedrawMap = {};
  let currentUploadedFontDataUrl = '';
  let currentUploadedFontFileName = '';
  let currentUploadedFontFormat = '';
  let currentLoginWallpaperDataUrl = '';
  let currentLoginWallpaperFileName = '';
  let currentLockscreenDefaultUsername = '';
  let currentLoginWallpaperResolvedDataUrl = '';
  let currentLoginWallpaperObjectUrl = '';
  let currentLaunchpadAppItems = [];
  let launchpadIconObserver = null;
  let launchpadIconRefreshRafId = 0;
  let lockscreenStyleObserver = null;
  let lockscreenStyleRafId = 0;
  let lockscreenStylePollTimer = 0;
  let hasLockscreenLifecycleHooks = false;
  let lastAppliedCustomJs = '';
  let isInjectionActive = false;
  let extensionContextInvalidated = false;

  const TITLEBAR_STYLES = {
    windows: 'windows_titlebar_mod.css',
    mac: 'mac_titlebar_mod.css'
  };

  const LAUNCHPAD_STYLES = {
    classic: 'classic_launchpad_mod.css',
    spotlight: 'spotlight_launchpad_mod.css'
  };

  function normalizeTitlebarStyle(style) {
    return style === 'mac' ? 'mac' : 'windows';
  }

  function normalizeLaunchpadStyle(style) {
    return style === 'spotlight' ? 'spotlight' : 'classic';
  }

  function isContextInvalidatedError(error) {
    const message = error?.message;
    return typeof message === 'string' && message.includes('Extension context invalidated');
  }

  function markContextInvalidated(error) {
    if (!isContextInvalidatedError(error)) return;
    extensionContextInvalidated = true;
    stopLaunchpadIconObserver();
  }

  function safeRuntimeGetURL(path) {
    if (extensionContextInvalidated) return '';
    if (typeof path !== 'string' || !path) return '';
    try {
      if (!chrome?.runtime?.id) return '';
      return chrome.runtime.getURL(path);
    } catch (error) {
      markContextInvalidated(error);
      return '';
    }
  }

  function getManifestVersion() {
    if (extensionContextInvalidated) return '';
    try {
      return String(chrome.runtime.getManifest()?.version || '');
    } catch (error) {
      markContextInvalidated(error);
      return '';
    }
  }

  function handleWebsiteVersionRequest(event) {
    if (!WEB_VERSION_ALLOWED_ORIGINS.has(ORIGIN)) return;
    if (event.source !== window) return;
    if (event.origin !== ORIGIN) return;

    const payload =
      event.data && typeof event.data === 'object' && !Array.isArray(event.data)
        ? event.data
        : null;
    if (!payload || payload.type !== WEB_VERSION_REQUEST_TYPE) return;

    const requestId = typeof payload.requestId === 'string' ? payload.requestId : '';
    const version = getManifestVersion();
    if (!version) return;

    window.postMessage(
      {
        type: WEB_VERSION_RESPONSE_TYPE,
        requestId,
        version
      },
      ORIGIN
    );
  }

  function ensureLaunchpadIconScaleStyle() {
    let style = document.getElementById(LAUNCHPAD_ICON_SCALE_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = LAUNCHPAD_ICON_SCALE_STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }

    const nextCss = [
      `.${LAUNCHPAD_ICON_BASE_CLASS} {`,
      '  position: relative;',
      '  overflow: visible;',
      '}',
      `.${LAUNCHPAD_ICON_BASE_CLASS} .semi-image {`,
      '  transform-origin: center center;',
      '  position: relative;',
      '  z-index: 1;',
      '}',
      `.${LAUNCHPAD_ICON_BLUR_CLONE_CLASS} {`,
      '  position: absolute;',
      '  inset: 0;',
      '  z-index: 0;',
      '  pointer-events: none;',
      '  transform: scale(1.25);',
      '  transform-origin: center center;',
      '  filter: blur(8px) saturate(115%);',
      '  opacity: 0.42;',
      '}',
      `.${LAUNCHPAD_ICON_BLUR_CLONE_CLASS} .${LAUNCHPAD_ICON_BLUR_CLONE_IMG_CLASS} {`,
      '  width: 100%;',
      '  height: 100%;',
      '  object-fit: contain;',
      '  display: block;',
      '}',
      `.${LAUNCHPAD_ICON_BOX_CLASS} .semi-image {`,
      '  transform: scale(0.75) !important;',
      '}',
      `.${LAUNCHPAD_ICON_MASK_ONLY_CLASS}:not(.${LAUNCHPAD_ICON_BOX_CLASS}) .semi-image {`,
      '  transform: none !important;',
      '}'
    ].join('\n');

    if (style.textContent !== nextCss) {
      style.textContent = nextCss;
    }
  }

  function hasAllClasses(el, classTokens) {
    if (!(el instanceof HTMLElement)) return false;
    return classTokens.every((token) => el.classList.contains(token));
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

  function normalizeLaunchpadRedrawMap(value, maxLength = 320) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const map = {};
    Object.entries(value).forEach(([rawKey, rawPath]) => {
      if (typeof rawKey !== 'string' || typeof rawPath !== 'string') return;
      const key = rawKey.trim().slice(0, maxLength);
      const path = rawPath.trim();
      if (!key) return;
      if (!/^prefect_icon\/[a-z0-9-]+\.png$/i.test(path)) return;
      map[key] = path;
    });
    return map;
  }

  function normalizeLaunchpadIconKey(rawValue) {
    if (typeof rawValue !== 'string') return '';
    const raw = rawValue.trim();
    if (!raw) return '';
    try {
      const url = new URL(raw, window.location.origin);
      return url.pathname.toLowerCase();
    } catch {
      return raw.split('?')[0].toLowerCase();
    }
  }

  function isLaunchpadIconKey(key) {
    if (typeof key !== 'string' || !key) return false;
    return LAUNCHPAD_ICON_SRC_PREFIXES.some((prefix) => key.includes(prefix));
  }

  function isLaunchpadDesktopIconCard(el) {
    return hasAllClasses(el, LAUNCHPAD_DESKTOP_ICON_CARD_CLASS_TOKENS);
  }

  function isLaunchpadPanelIconCard(el) {
    return hasAllClasses(el, LAUNCHPAD_PANEL_ICON_CARD_CLASS_TOKENS);
  }

  function collectLaunchpadIconCards() {
    const cards = [];
    document
      .querySelectorAll('div.cursor-pointer')
      .forEach((candidateEl) => {
        if (!(candidateEl instanceof HTMLElement)) return;
        if (
          !isLaunchpadDesktopIconCard(candidateEl) &&
          !isLaunchpadPanelIconCard(candidateEl)
        ) {
          return;
        }
        const key = extractLaunchpadAppKey(candidateEl);
        if (!key) return;
        cards.push(candidateEl);
      });
    return cards;
  }

  function findLaunchpadIconBox(cardEl) {
    if (!(cardEl instanceof HTMLElement)) return null;

    const candidates = Array.from(cardEl.querySelectorAll('div.box-border'));
    for (const candidate of candidates) {
      if (!(candidate instanceof HTMLElement)) continue;
      if (!hasAllClasses(candidate, LAUNCHPAD_ICON_BOX_CLASS_TOKENS)) continue;
      if (!candidate.querySelector('.semi-image')) continue;
      return candidate;
    }

    return null;
  }

  function extractLaunchpadAppTitle(cardEl) {
    if (!(cardEl instanceof HTMLElement)) return '';

    const titleNodes = Array.from(cardEl.querySelectorAll('.line-clamp-1[title], div[title], span[title]'));
    for (const node of titleNodes) {
      if (!(node instanceof HTMLElement)) continue;
      const title = (node.getAttribute('title') || '').trim();
      if (title) return title;
    }

    const titleText = cardEl
      .querySelector('.py-base-loose')
      ?.textContent
      ?.trim();
    return typeof titleText === 'string' ? titleText : '';
  }

  function extractLaunchpadAppKey(cardEl) {
    if (!(cardEl instanceof HTMLElement)) return '';
    const imageEl = getLaunchpadIconImageElement(cardEl);
    if (!(imageEl instanceof HTMLImageElement)) return '';

    const rawDataSrc =
      imageEl.getAttribute(LAUNCHPAD_ICON_ORIGINAL_DATA_SRC_ATTR) ||
      imageEl.getAttribute('data-src') ||
      '';
    const rawSrc =
      imageEl.getAttribute(LAUNCHPAD_ICON_ORIGINAL_SRC_ATTR) ||
      imageEl.getAttribute('src') ||
      '';
    const keyFromDataSrc = normalizeLaunchpadIconKey(rawDataSrc);
    const keyFromSrc = normalizeLaunchpadIconKey(rawSrc);
    const key = keyFromDataSrc || keyFromSrc;
    if (!isLaunchpadIconKey(key)) return '';
    return key;
  }

  function getLaunchpadIconImageElement(cardEl) {
    if (!(cardEl instanceof HTMLElement)) return null;
    const imageEl = cardEl.querySelector('.semi-image img');
    if (!(imageEl instanceof HTMLImageElement)) return null;
    return imageEl;
  }

  function getLaunchpadIconImageSource(cardEl) {
    if (!(cardEl instanceof HTMLElement)) return '';
    const imageEl = getLaunchpadIconImageElement(cardEl);
    if (!(imageEl instanceof HTMLImageElement)) return '';
    const currentSrc = imageEl.currentSrc || '';
    if (typeof currentSrc === 'string' && currentSrc.trim()) return currentSrc.trim();

    const rawSrc = (imageEl.getAttribute('src') || '').trim();
    if (rawSrc) return rawSrc;
    return (imageEl.getAttribute('data-src') || '').trim();
  }

  function restoreLaunchpadRedrawIconFromImage(imageEl) {
    if (!(imageEl instanceof HTMLImageElement)) return;
    if (!imageEl.hasAttribute(LAUNCHPAD_ICON_ORIGINAL_SRC_ATTR)) return;
    const originalSrc = imageEl.getAttribute(LAUNCHPAD_ICON_ORIGINAL_SRC_ATTR) || '';
    const originalDataSrc =
      imageEl.getAttribute(LAUNCHPAD_ICON_ORIGINAL_DATA_SRC_ATTR) || '';

    if (originalSrc) {
      imageEl.setAttribute('src', originalSrc);
    } else {
      imageEl.removeAttribute('src');
    }

    if (originalDataSrc) {
      imageEl.setAttribute('data-src', originalDataSrc);
    } else {
      imageEl.removeAttribute('data-src');
    }

    imageEl.removeAttribute(LAUNCHPAD_ICON_ORIGINAL_SRC_ATTR);
    imageEl.removeAttribute(LAUNCHPAD_ICON_ORIGINAL_DATA_SRC_ATTR);
  }

  function restoreLaunchpadRedrawIcon(cardEl) {
    const imageEl = getLaunchpadIconImageElement(cardEl);
    if (!(imageEl instanceof HTMLImageElement)) return;
    restoreLaunchpadRedrawIconFromImage(imageEl);
  }

  function resolveLaunchpadRedrawPath(cardEl) {
    const key = extractLaunchpadAppKey(cardEl);
    if (!key) return '';
    const path = currentLaunchpadIconRedrawMap[key];
    if (typeof path !== 'string' || !path.trim()) return '';
    if (!/^prefect_icon\/[a-z0-9-]+\.png$/i.test(path)) return '';
    return path.trim();
  }

  function applyLaunchpadRedrawIcon(cardEl) {
    const imageEl = getLaunchpadIconImageElement(cardEl);
    if (!(imageEl instanceof HTMLImageElement)) return;
    const redrawPath = resolveLaunchpadRedrawPath(cardEl);
    if (!redrawPath) {
      restoreLaunchpadRedrawIconFromImage(imageEl);
      return;
    }

    if (!imageEl.hasAttribute(LAUNCHPAD_ICON_ORIGINAL_SRC_ATTR)) {
      imageEl.setAttribute(
        LAUNCHPAD_ICON_ORIGINAL_SRC_ATTR,
        imageEl.getAttribute('src') || ''
      );
    }
    if (!imageEl.hasAttribute(LAUNCHPAD_ICON_ORIGINAL_DATA_SRC_ATTR)) {
      imageEl.setAttribute(
        LAUNCHPAD_ICON_ORIGINAL_DATA_SRC_ATTR,
        imageEl.getAttribute('data-src') || ''
      );
    }

    const redrawUrl = safeRuntimeGetURL(redrawPath);
    if (!redrawUrl) {
      restoreLaunchpadRedrawIconFromImage(imageEl);
      return;
    }
    if (imageEl.getAttribute('src') !== redrawUrl) {
      imageEl.setAttribute('src', redrawUrl);
    }
  }

  function normalizeLaunchpadPreviewSource(rawSource) {
    if (typeof rawSource !== 'string') return '';
    const source = rawSource.trim();
    if (!source) return '';
    try {
      return new URL(source, window.location.origin).toString();
    } catch {
      return source;
    }
  }

  function ensureLaunchpadBlurClone(boxEl, cardEl) {
    if (!(boxEl instanceof HTMLElement)) return;
    const source = getLaunchpadIconImageSource(cardEl);
    if (!source) return;

    let cloneEl = boxEl.querySelector(`:scope > .${LAUNCHPAD_ICON_BLUR_CLONE_CLASS}`);
    if (!(cloneEl instanceof HTMLElement)) {
      cloneEl = document.createElement('div');
      cloneEl.className = LAUNCHPAD_ICON_BLUR_CLONE_CLASS;
      const cloneImgEl = document.createElement('img');
      cloneImgEl.className = LAUNCHPAD_ICON_BLUR_CLONE_IMG_CLASS;
      cloneImgEl.alt = '';
      cloneEl.appendChild(cloneImgEl);
      boxEl.insertBefore(cloneEl, boxEl.firstChild);
    }

    const cloneImgEl = cloneEl.querySelector(`img.${LAUNCHPAD_ICON_BLUR_CLONE_IMG_CLASS}`);
    if (!(cloneImgEl instanceof HTMLImageElement)) return;
    if (cloneImgEl.getAttribute('src') !== source) {
      cloneImgEl.setAttribute('src', source);
    }
  }

  function removeLaunchpadBlurClone(boxEl) {
    if (!(boxEl instanceof HTMLElement)) return;
    boxEl
      .querySelectorAll(`:scope > .${LAUNCHPAD_ICON_BLUR_CLONE_CLASS}`)
      .forEach((cloneEl) => {
        if (!(cloneEl instanceof HTMLElement)) return;
        cloneEl.remove();
      });
  }

  function collectLaunchpadAppItems() {
    const itemMap = new Map();
    const cards = collectLaunchpadIconCards();
    cards.forEach((cardEl) => {
      const key = extractLaunchpadAppKey(cardEl);
      if (!key) return;
      const title = extractLaunchpadAppTitle(cardEl);
      if (itemMap.has(key)) return;
      itemMap.set(key, {
        key,
        title: title || key.split('/').pop() || key,
        iconSrc: normalizeLaunchpadPreviewSource(getLaunchpadIconImageSource(cardEl))
      });
    });
    return Array.from(itemMap.values());
  }

  function shouldScaleLaunchpadCard(cardEl, selectedSet) {
    const key = extractLaunchpadAppKey(cardEl);
    if (!key) return false;
    if (!(selectedSet instanceof Set) || selectedSet.size === 0) return false;
    return selectedSet.has(key);
  }

  function shouldMaskOnlyLaunchpadCard(cardEl, maskOnlySet) {
    if (!(maskOnlySet instanceof Set) || maskOnlySet.size === 0) return false;
    const key = extractLaunchpadAppKey(cardEl);
    if (!key) return false;
    return maskOnlySet.has(key);
  }

  function shouldRedrawLaunchpadCard(cardEl, redrawSet) {
    if (!(redrawSet instanceof Set) || redrawSet.size === 0) return false;
    const key = extractLaunchpadAppKey(cardEl);
    if (!key) return false;
    return redrawSet.has(key);
  }

  function setLaunchpadIconScaleOnDom(enabled) {
    const selectedSet = new Set(currentLaunchpadIconScaleSelectedKeys);
    const maskOnlySet = new Set(currentLaunchpadIconMaskOnlyKeys);
    const redrawSet = new Set(currentLaunchpadIconRedrawKeys);
    const cards = collectLaunchpadIconCards();
    const matchedBoxes = new Set();

    cards.forEach((cardEl) => {
      const boxEl = findLaunchpadIconBox(cardEl);
      if (!(boxEl instanceof HTMLElement)) return;
      matchedBoxes.add(boxEl);
      const shouldScale = enabled && shouldScaleLaunchpadCard(cardEl, selectedSet);
      const shouldMaskOnly =
        enabled && shouldMaskOnlyLaunchpadCard(cardEl, maskOnlySet);
      const shouldRedraw =
        enabled && shouldRedrawLaunchpadCard(cardEl, redrawSet);
      const shouldProcess = shouldScale || shouldMaskOnly;
      boxEl.classList.toggle(LAUNCHPAD_ICON_BASE_CLASS, shouldProcess);
      boxEl.classList.toggle(LAUNCHPAD_ICON_BOX_CLASS, shouldScale);
      boxEl.classList.toggle(LAUNCHPAD_ICON_MASK_ONLY_CLASS, shouldMaskOnly);
      if (shouldScale) {
        ensureLaunchpadBlurClone(boxEl, cardEl);
      } else {
        removeLaunchpadBlurClone(boxEl);
      }
      if (shouldRedraw) {
        applyLaunchpadRedrawIcon(cardEl);
      } else {
        restoreLaunchpadRedrawIcon(cardEl);
      }
    });
    document
      .querySelectorAll(
        `.${LAUNCHPAD_ICON_BASE_CLASS}, .${LAUNCHPAD_ICON_BOX_CLASS}, .${LAUNCHPAD_ICON_MASK_ONLY_CLASS}`
      )
      .forEach((boxEl) => {
        if (!(boxEl instanceof HTMLElement)) return;
        if (enabled && matchedBoxes.has(boxEl)) return;
        boxEl.classList.remove(LAUNCHPAD_ICON_BASE_CLASS);
        boxEl.classList.remove(LAUNCHPAD_ICON_BOX_CLASS);
        boxEl.classList.remove(LAUNCHPAD_ICON_MASK_ONLY_CLASS);
        removeLaunchpadBlurClone(boxEl);
      });

    document
      .querySelectorAll(
        `img[${LAUNCHPAD_ICON_ORIGINAL_SRC_ATTR}], img[${LAUNCHPAD_ICON_ORIGINAL_DATA_SRC_ATTR}]`
      )
      .forEach((imageEl) => {
        if (!(imageEl instanceof HTMLImageElement)) return;
        const cardEl = imageEl.closest('div.cursor-pointer');
        if (!(cardEl instanceof HTMLElement)) {
          restoreLaunchpadRedrawIconFromImage(imageEl);
          return;
        }
        const shouldKeep =
          enabled && shouldRedrawLaunchpadCard(cardEl, redrawSet);
        if (!shouldKeep) {
          restoreLaunchpadRedrawIconFromImage(imageEl);
        }
      });
  }

  function refreshLaunchpadIconState() {
    launchpadIconRefreshRafId = 0;
    currentLaunchpadAppItems = collectLaunchpadAppItems();
    window.__fnosLaunchpadAppIconItems = currentLaunchpadAppItems.map((item) => ({
      key: item.key,
      title: item.title,
      iconSrc: item.iconSrc
    }));
    window.__fnosLaunchpadAppIconTitles = currentLaunchpadAppItems.map((item) => item.title);

    if (currentLaunchpadIconScaleEnabled) {
      ensureLaunchpadIconScaleStyle();
    }
    setLaunchpadIconScaleOnDom(currentLaunchpadIconScaleEnabled);
  }

  function scheduleLaunchpadIconRefresh() {
    if (launchpadIconRefreshRafId) return;
    launchpadIconRefreshRafId = window.requestAnimationFrame(refreshLaunchpadIconState);
  }

  function stopLaunchpadIconObserver() {
    if (launchpadIconObserver) {
      launchpadIconObserver.disconnect();
      launchpadIconObserver = null;
    }
    if (launchpadIconRefreshRafId) {
      window.cancelAnimationFrame(launchpadIconRefreshRafId);
      launchpadIconRefreshRafId = 0;
    }
  }

  function startLaunchpadIconObserver() {
    if (!(document.body instanceof HTMLElement)) {
      document.addEventListener(
        'DOMContentLoaded',
        () => {
          if (!currentLaunchpadIconScaleEnabled) return;
          startLaunchpadIconObserver();
          scheduleLaunchpadIconRefresh();
        },
        { once: true }
      );
      return;
    }
    if (launchpadIconObserver) return;

    launchpadIconObserver = new MutationObserver(() => {
      scheduleLaunchpadIconRefresh();
    });

    launchpadIconObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['class', 'title', 'src', 'data-src']
    });
  }

  function updateLaunchpadIconScaleEnabled(
    nextEnabled,
    nextSelectedKeys = [],
    nextMaskOnlyKeys = [],
    nextRedrawKeys = [],
    nextRedrawMap = {}
  ) {
    currentLaunchpadIconScaleEnabled = Boolean(nextEnabled);
    const normalizedRedrawMap = normalizeLaunchpadRedrawMap(nextRedrawMap);
    const normalizedRedrawKeys = normalizeLaunchpadKeyList(nextRedrawKeys).filter(
      (key) => typeof normalizedRedrawMap[key] === 'string'
    );
    const redrawSet = new Set(normalizedRedrawKeys);
    currentLaunchpadIconRedrawKeys = normalizedRedrawKeys;
    currentLaunchpadIconRedrawMap = {};
    currentLaunchpadIconRedrawKeys.forEach((key) => {
      currentLaunchpadIconRedrawMap[key] = normalizedRedrawMap[key];
    });
    currentLaunchpadIconMaskOnlyKeys = normalizeLaunchpadKeyList(
      nextMaskOnlyKeys
    ).filter((key) => !redrawSet.has(key));
    currentLaunchpadIconScaleSelectedKeys = normalizeLaunchpadKeyList(
      nextSelectedKeys
    ).filter((key) => !redrawSet.has(key));
    if (currentLaunchpadIconScaleEnabled) {
      startLaunchpadIconObserver();
      scheduleLaunchpadIconRefresh();
      return;
    }

    stopLaunchpadIconObserver();
    setLaunchpadIconScaleOnDom(false);
    currentLaunchpadAppItems = collectLaunchpadAppItems();
    window.__fnosLaunchpadAppIconItems = currentLaunchpadAppItems.map((item) => ({
      key: item.key,
      title: item.title,
      iconSrc: item.iconSrc
    }));
    window.__fnosLaunchpadAppIconTitles = currentLaunchpadAppItems.map((item) => item.title);
  }

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

  function getFontStyleElement() {
    let style = document.getElementById(FONT_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = FONT_STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    return style;
  }

  function getCustomCssStyleElement() {
    let style = document.getElementById(CUSTOM_CSS_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = CUSTOM_CSS_STYLE_ID;
      (document.head || document.documentElement).appendChild(style);
    }
    return style;
  }

  function getDesktopIconLayoutStyleElement() {
    let style = document.getElementById(DESKTOP_ICON_LAYOUT_STYLE_ID);
    if (!style) {
      style = document.createElement('style');
      style.id = DESKTOP_ICON_LAYOUT_STYLE_ID;
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

  function clearBrandPaletteInline(target) {
    if (!target?.style) return;
    for (let i = 0; i < 10; i += 1) {
      target.style.removeProperty(`--semi-brand-${i}`);
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
    if (!currentBasePresetEnabled) return;
    applyBrandPalette(currentBrandColor);
    syncLockscreenTextAvatar();
  }

  function normalizeText(value, maxLength = 300) {
    if (typeof value !== 'string') return '';
    return value.trim().slice(0, maxLength);
  }

  function normalizeDesktopIconPerColumn(value) {
    const parsed = Number.parseInt(String(value ?? ''), 10);
    if (!Number.isFinite(parsed)) return DESKTOP_ICON_PER_COLUMN_DEFAULT;
    return Math.max(
      DESKTOP_ICON_PER_COLUMN_MIN,
      Math.min(DESKTOP_ICON_PER_COLUMN_MAX, parsed)
    );
  }

  function normalizeDesktopIconLayoutMode(value, legacyEnabled) {
    const normalized =
      typeof value === 'string' ? value.trim().toLowerCase() : '';
    if (normalized === 'adaptive' || normalized === 'fixed') {
      return normalized;
    }
    if (typeof legacyEnabled === 'boolean') {
      return legacyEnabled ? 'fixed' : 'adaptive';
    }
    return DESKTOP_ICON_LAYOUT_MODE_DEFAULT;
  }

  function normalizeDesktopIconLayoutEnabled(value) {
    return typeof value === 'boolean' ? value : true;
  }

  function updateDesktopIconLayout(
    nextValue,
    nextMode = DESKTOP_ICON_LAYOUT_MODE_DEFAULT,
    nextEnabled = true
  ) {
    currentDesktopIconLayoutEnabled = normalizeDesktopIconLayoutEnabled(nextEnabled);
    currentDesktopIconPerColumn = normalizeDesktopIconPerColumn(nextValue);
    currentDesktopIconLayoutMode = normalizeDesktopIconLayoutMode(nextMode);
    syncDesktopIconLayoutCss();
    if (!currentDesktopIconLayoutEnabled) {
      removeElementById(DESKTOP_ICON_LAYOUT_STYLE_ID);
      return;
    }
    const style = getDesktopIconLayoutStyleElement();
    const rowsTemplate =
      currentDesktopIconLayoutMode === 'fixed'
        ? `repeat(${currentDesktopIconPerColumn}, minmax(0, 1fr))`
        : 'repeat(var(--fn-desktop-icons-adaptive-target), minmax(0, 1fr))';
    style.textContent = [
      ':root {',
      `  --fn-desktop-icons-per-column: ${currentDesktopIconPerColumn} !important;`,
      '}',
      `${DESKTOP_ICON_GRID_SELECTOR} {`,
      `  grid-template-rows: ${rowsTemplate} !important;`,
      '}'
    ].join('\n');
  }

  function normalizeFontWeight(value) {
    const raw = normalizeText(value, 16);
    if (!raw) return '';
    const lowered = raw.toLowerCase();
    if (/^(normal|bold|bolder|lighter)$/.test(lowered)) {
      return lowered;
    }
    if (/^\d{1,4}$/.test(raw)) {
      const numeric = Math.max(1, Math.min(1000, Number(raw)));
      return String(numeric);
    }
    return '';
  }

  function normalizeFontFaceName(value) {
    const cleaned = normalizeText(value, 64).replace(/["'`]/g, '');
    return cleaned || FONT_DEFAULT_FACE_NAME;
  }

  function normalizeFontUrl(value) {
    const raw = normalizeText(value, 800);
    if (!raw) return '';
    try {
      const parsed = new URL(raw);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return '';
      }
      return parsed.toString();
    } catch (_error) {
      return '';
    }
  }

  function normalizeFontSettings(raw) {
    return {
      enabled: Boolean(raw?.enabled),
      family: normalizeText(raw?.family, 400),
      weight: normalizeFontWeight(raw?.weight),
      featureSettings: normalizeText(raw?.featureSettings, 200),
      faceName: normalizeFontFaceName(raw?.faceName),
      url: normalizeFontUrl(raw?.url)
    };
  }

  function normalizeCodeText(value, maxLength = 120000) {
    if (typeof value !== 'string') return '';
    return value.slice(0, maxLength);
  }

  function normalizeCustomCodeSettings(raw) {
    return {
      enabled: Boolean(raw?.enabled),
      css: normalizeCodeText(raw?.css),
      js: normalizeCodeText(raw?.js)
    };
  }

  function escapeCssString(value) {
    return String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  }

  function inferLoginWallpaperMimeType(fileName) {
    if (typeof fileName !== 'string') return '';
    const lower = fileName.trim().toLowerCase();
    if (lower.endsWith('.webp')) return 'image/webp';
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    return '';
  }

  function normalizeLoginWallpaperDataUrl(dataUrl, fileName) {
    const normalizedDataUrl = typeof dataUrl === 'string' ? dataUrl.trim() : '';
    if (!normalizedDataUrl) return '';

    const headerMatch = normalizedDataUrl.match(/^data:([^;,]*)(;base64)?,/i);
    if (!headerMatch) return normalizedDataUrl;

    const rawMime = (headerMatch[1] || '').toLowerCase();
    const base64Token = headerMatch[2] || '';
    const payload = normalizedDataUrl.slice(headerMatch[0].length);

    const aliasNormalizedMime =
      rawMime === 'image/jpg' || rawMime === 'image/pjpeg'
        ? 'image/jpeg'
        : rawMime === 'image/x-png'
          ? 'image/png'
          : rawMime;

    const inferredMime = inferLoginWallpaperMimeType(fileName);
    const shouldUseInferredMime =
      aliasNormalizedMime === '' ||
      aliasNormalizedMime === 'application/octet-stream' ||
      aliasNormalizedMime === 'application/x-octet-stream' ||
      aliasNormalizedMime === 'binary/octet-stream';
    const targetMime =
      shouldUseInferredMime && inferredMime ? inferredMime : aliasNormalizedMime;

    if (!targetMime || targetMime === rawMime) return normalizedDataUrl;
    return `data:${targetMime}${base64Token},${payload}`;
  }

  function revokeLoginWallpaperObjectUrl() {
    if (!currentLoginWallpaperObjectUrl) return;
    try {
      URL.revokeObjectURL(currentLoginWallpaperObjectUrl);
    } catch (_error) {
      // ignore revoke failures
    }
    currentLoginWallpaperObjectUrl = '';
    currentLoginWallpaperResolvedDataUrl = '';
  }

  function decodeBase64ToUint8Array(base64Payload) {
    const binary = atob(base64Payload);
    const length = binary.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i += 1) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  function dataUrlToBlob(dataUrl) {
    const match = dataUrl.match(/^data:([^;,]*)(;base64)?,([\s\S]*)$/i);
    if (!match) return null;

    const mimeType = (match[1] || 'application/octet-stream').toLowerCase();
    const base64Token = match[2] || '';
    const payload = match[3] || '';

    try {
      if (base64Token) {
        return new Blob([decodeBase64ToUint8Array(payload)], { type: mimeType });
      }
      return new Blob([decodeURIComponent(payload)], { type: mimeType });
    } catch (_error) {
      return null;
    }
  }

  function resolveLoginWallpaperUrl(normalizedDataUrl) {
    if (!normalizedDataUrl) return '';
    if (
      currentLoginWallpaperResolvedDataUrl === normalizedDataUrl &&
      currentLoginWallpaperObjectUrl
    ) {
      return currentLoginWallpaperObjectUrl;
    }

    revokeLoginWallpaperObjectUrl();

    if (!normalizedDataUrl.startsWith('data:')) {
      return normalizedDataUrl;
    }

    const blob = dataUrlToBlob(normalizedDataUrl);
    if (!(blob instanceof Blob)) {
      return normalizedDataUrl;
    }

    try {
      currentLoginWallpaperObjectUrl = URL.createObjectURL(blob);
      currentLoginWallpaperResolvedDataUrl = normalizedDataUrl;
      return currentLoginWallpaperObjectUrl;
    } catch (_error) {
      currentLoginWallpaperObjectUrl = '';
      currentLoginWallpaperResolvedDataUrl = '';
      return normalizedDataUrl;
    }
  }

  function inferFontFormat(source, fallback) {
    const lower = `${source || ''} ${fallback || ''}`.toLowerCase();
    if (lower.includes('woff2')) return 'woff2';
    if (lower.includes('woff')) return 'woff';
    if (lower.includes('otf') || lower.includes('opentype')) return 'opentype';
    if (lower.includes('ttf') || lower.includes('truetype')) return 'truetype';
    return '';
  }

  function buildFontOverrideCss(settings) {
    if (!settings.enabled) return '';

    const faceName = normalizeFontFaceName(settings.faceName);
    const escapedFaceName = escapeCssString(faceName);
    const fontBlocks = [];
    const familyParts = [];

    if (currentUploadedFontDataUrl) {
      const format =
        currentUploadedFontFormat ||
        inferFontFormat(currentUploadedFontFileName, currentUploadedFontDataUrl);
      const formatToken = format ? ` format("${format}")` : '';
      fontBlocks.push(
        `@font-face {\n` +
          `  font-family: "${escapedFaceName}";\n` +
          `  src: url("${escapeCssString(currentUploadedFontDataUrl)}")${formatToken};\n` +
          `  font-display: swap;\n` +
          `}`
      );
      familyParts.push(`"${escapedFaceName}"`);
    } else if (settings.url) {
      const format = inferFontFormat(settings.url);
      const formatToken = format ? ` format("${format}")` : '';
      fontBlocks.push(
        `@font-face {\n` +
          `  font-family: "${escapedFaceName}";\n` +
          `  src: url("${escapeCssString(settings.url)}")${formatToken};\n` +
          `  font-display: swap;\n` +
          `}`
      );
      familyParts.push(`"${escapedFaceName}"`);
    }

    if (settings.family) {
      familyParts.push(settings.family);
    }

    if (!familyParts.length) return fontBlocks.join('\n\n');

    const declarations = [`  font-family: ${familyParts.join(', ')} !important;`];
    if (settings.weight) {
      declarations.push(`  font-weight: ${settings.weight} !important;`);
    }
    if (settings.featureSettings) {
      declarations.push(
        `  font-feature-settings: ${settings.featureSettings} !important;`
      );
    }

    const selectors = [
      ':root',
      'body',
      '#root',
      '#root *',
      '.semi-theme',
      '.semi-theme *'
    ].join(', ');

    const ruleBlock = `${selectors} {\n${declarations.join('\n')}\n}`;
    if (!fontBlocks.length) return ruleBlock;
    return `${fontBlocks.join('\n\n')}\n\n${ruleBlock}`;
  }

  function updateFontSettings(nextSettings) {
    currentFontSettings = normalizeFontSettings(nextSettings || currentFontSettings);
    const style = getFontStyleElement();
    style.textContent = buildFontOverrideCss(currentFontSettings);
  }

  function removeElementById(id) {
    const element = document.getElementById(id);
    if (element) {
      element.remove();
    }
  }

  function isElementVisiblyRendered(element) {
    if (!(element instanceof HTMLElement)) return false;
    const computed = window.getComputedStyle(element);
    return (
      computed.display !== 'none' &&
      computed.visibility !== 'hidden' &&
      Number.parseFloat(computed.opacity || '1') > 0.01 &&
      element.getClientRects().length > 0
    );
  }

  function getLockscreenPinyinInitial(char) {
    if (!/[\u3400-\u9fff]/.test(char)) return '';
    for (let i = LOCKSCREEN_PINYIN_BOUNDARIES.length - 1; i >= 0; i -= 1) {
      const boundary = LOCKSCREEN_PINYIN_BOUNDARIES[i];
      if (LOCKSCREEN_PINYIN_COLLATOR.compare(char, boundary) >= 0) {
        return LOCKSCREEN_PINYIN_INITIALS.charAt(i);
      }
    }
    return LOCKSCREEN_PINYIN_INITIALS.charAt(0);
  }

  function getLockscreenAvatarInitial(value) {
    if (typeof value !== 'string') return '?';
    const trimmed = value.trim();
    if (!trimmed) return '?';
    const firstChar = Array.from(trimmed)[0] || '';
    if (!firstChar) return '?';
    if (/[A-Za-z]/.test(firstChar)) return firstChar.toUpperCase();
    if (/[0-9]/.test(firstChar)) return firstChar;
    const pinyinInitial = getLockscreenPinyinInitial(firstChar);
    if (pinyinInitial) return pinyinInitial;
    return firstChar.toUpperCase();
  }

  function resolveLockscreenAvatarSource(loginFormElement, formElement) {
    const usernameInput = formElement.querySelector(
      'input#username, input[name="username"]'
    );
    if (usernameInput instanceof HTMLInputElement) {
      const inputValue = usernameInput.value.trim();
      if (inputValue) return inputValue;
    }

    const usernameLabel =
      loginFormElement.querySelector('p[title]') ||
      loginFormElement.querySelector(
        'p.text-\\[18px\\].min-h-\\[26px\\].leading-xl.text-center.mt-5.mb-\\[22px\\].select-none'
      );
    if (usernameLabel instanceof HTMLElement) {
      const titleValue = usernameLabel.getAttribute('title');
      if (typeof titleValue === 'string' && titleValue.trim()) {
        return titleValue.trim();
      }
      if (typeof usernameLabel.textContent === 'string') {
        const textValue = usernameLabel.textContent.trim();
        if (textValue) return textValue;
      }
    }

    return '';
  }

  function parseRgbTriplet(value) {
    if (typeof value !== 'string') return null;
    const match = value
      .trim()
      .match(/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/);
    if (!match) return null;
    return {
      r: clamp255(Number.parseInt(match[1], 10)),
      g: clamp255(Number.parseInt(match[2], 10)),
      b: clamp255(Number.parseInt(match[3], 10))
    };
  }

  function getLockscreenAvatarThemeRgb(sourceElement) {
    if (sourceElement instanceof HTMLElement) {
      const computed = window.getComputedStyle(sourceElement);
      const fromCssVar = parseRgbTriplet(
        computed.getPropertyValue('--semi-brand-4')
      );
      if (fromCssVar) return fromCssVar;
    }

    return (
      hexToRgb(normalizeHex(currentBrandColor)) ||
      hexToRgb(THEME_DEFAULT_BRAND) || {
        r: 0,
        g: 102,
        b: 255
      }
    );
  }

  function getLockscreenAvatarTextColor({ r, g, b }) {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness >= 168 ? '#101114' : '#FFFFFF';
  }

  function syncLockscreenAvatarTheme(avatarElement, sourceElement) {
    if (!(avatarElement instanceof HTMLElement)) return;
    const rgb = getLockscreenAvatarThemeRgb(sourceElement);
    avatarElement.style.setProperty('--fnos-lockscreen-avatar-bg', formatRgb(rgb));
    avatarElement.style.setProperty(
      '--fnos-lockscreen-avatar-fg',
      getLockscreenAvatarTextColor(rgb)
    );
  }

  function normalizeLockscreenDefaultUsername(value) {
    return normalizeText(value, LOCKSCREEN_DEFAULT_USERNAME_MAX);
  }

  function resolveLockscreenUsernameFieldContainer(usernameInput) {
    if (!(usernameInput instanceof HTMLInputElement)) return null;
    const container =
      usernameInput.closest('.semi-form-field') ||
      usernameInput.closest('.semi-input-wrapper')?.parentElement ||
      usernameInput.parentElement;
    return container instanceof HTMLElement ? container : null;
  }

  function setLockscreenUsernameInputValue(usernameInput, value) {
    if (!(usernameInput instanceof HTMLInputElement)) return;
    if (usernameInput.value === value) return;
    usernameInput.value = value;
    usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
    usernameInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function hideLockscreenUsernameFieldContainer(fieldContainer) {
    if (!(fieldContainer instanceof HTMLElement)) return;
    if (
      fieldContainer.getAttribute(LOCKSCREEN_DEFAULT_USERNAME_FIELD_HIDDEN_ATTR) ===
      '1'
    ) {
      return;
    }

    fieldContainer.setAttribute(LOCKSCREEN_DEFAULT_USERNAME_FIELD_HIDDEN_ATTR, '1');
    fieldContainer.setAttribute(
      LOCKSCREEN_DEFAULT_USERNAME_FIELD_DISPLAY_ATTR,
      fieldContainer.style.getPropertyValue('display') || ''
    );
    fieldContainer.style.setProperty('display', 'none', 'important');
  }

  function showLockscreenUsernameFieldContainer(fieldContainer) {
    if (!(fieldContainer instanceof HTMLElement)) return;
    if (
      fieldContainer.getAttribute(LOCKSCREEN_DEFAULT_USERNAME_FIELD_HIDDEN_ATTR) !==
      '1'
    ) {
      return;
    }

    const previousDisplay =
      fieldContainer.getAttribute(LOCKSCREEN_DEFAULT_USERNAME_FIELD_DISPLAY_ATTR) ||
      '';
    fieldContainer.removeAttribute(LOCKSCREEN_DEFAULT_USERNAME_FIELD_HIDDEN_ATTR);
    fieldContainer.removeAttribute(LOCKSCREEN_DEFAULT_USERNAME_FIELD_DISPLAY_ATTR);
    if (previousDisplay) {
      fieldContainer.style.setProperty('display', previousDisplay);
    } else {
      fieldContainer.style.removeProperty('display');
    }
  }

  function syncLockscreenDefaultUsername() {
    const loginForm = document.querySelector('.login-form');
    if (!(loginForm instanceof HTMLElement)) return;
    const loginInnerForm = loginForm.querySelector('form');
    if (!(loginInnerForm instanceof HTMLElement)) return;

    const usernameInput = loginInnerForm.querySelector(
      'input#username, input[name="username"]'
    );
    const usernameFieldContainer =
      resolveLockscreenUsernameFieldContainer(usernameInput);
    const row = loginInnerForm.querySelector(
      `.${LOCKSCREEN_DEFAULT_USERNAME_ROW_CLASS}`
    );
    const switchButton = loginForm.querySelector(
      `.${LOCKSCREEN_SWITCH_ACCOUNT_BUTTON_CLASS}`
    );
    const normalizedUsername = normalizeLockscreenDefaultUsername(
      currentLockscreenDefaultUsername
    );

    if (!(usernameInput instanceof HTMLInputElement) || !normalizedUsername) {
      showLockscreenUsernameFieldContainer(usernameFieldContainer);
      if (row instanceof HTMLElement) {
        row.remove();
      }
      if (switchButton instanceof HTMLElement) {
        switchButton.remove();
      }
      return;
    }

    const isManualMode =
      loginInnerForm.getAttribute(LOCKSCREEN_MANUAL_ACCOUNT_MODE_ATTR) === '1';
    if (isManualMode) {
      showLockscreenUsernameFieldContainer(usernameFieldContainer);
      if (row instanceof HTMLElement) {
        row.remove();
      }
      if (switchButton instanceof HTMLElement) {
        switchButton.remove();
      }
      return;
    }

    setLockscreenUsernameInputValue(usernameInput, normalizedUsername);
    if (!(usernameFieldContainer instanceof HTMLElement)) return;

    let usernameRow = row;
    if (!(usernameRow instanceof HTMLElement)) {
      usernameRow = document.createElement('div');
      usernameRow.className = LOCKSCREEN_DEFAULT_USERNAME_ROW_CLASS;

      const usernameText = document.createElement('span');
      usernameText.className = LOCKSCREEN_DEFAULT_USERNAME_TEXT_CLASS;
      usernameRow.appendChild(usernameText);
    }

    const usernameText = usernameRow.querySelector(
      `.${LOCKSCREEN_DEFAULT_USERNAME_TEXT_CLASS}`
    );
    if (usernameText instanceof HTMLElement) {
      usernameText.textContent = normalizedUsername;
      usernameText.setAttribute('title', normalizedUsername);
    }

    let switchAccountButton =
      switchButton instanceof HTMLButtonElement ? switchButton : null;
    if (
      !(switchAccountButton instanceof HTMLButtonElement) ||
      switchAccountButton.parentElement !== loginForm
    ) {
      if (switchButton instanceof HTMLElement) {
        switchButton.remove();
      }
      switchAccountButton = document.createElement('button');
      switchAccountButton.type = 'button';
      switchAccountButton.className = LOCKSCREEN_SWITCH_ACCOUNT_BUTTON_CLASS;
      switchAccountButton.setAttribute('aria-label', '\u5207\u6362\u7528\u6237');

      const icon = document.createElement('span');
      icon.className = LOCKSCREEN_SWITCH_ACCOUNT_ICON_CLASS;
      icon.setAttribute('aria-hidden', 'true');
      switchAccountButton.appendChild(icon);

      const label = document.createElement('span');
      label.className = LOCKSCREEN_SWITCH_ACCOUNT_LABEL_CLASS;
      label.textContent = '\u5207\u6362\u7528\u6237';
      switchAccountButton.appendChild(label);

      loginForm.appendChild(switchAccountButton);
    }

    if (
      switchAccountButton instanceof HTMLButtonElement &&
      switchAccountButton.getAttribute(
        LOCKSCREEN_DEFAULT_USERNAME_SWITCH_BOUND_ATTR
      ) !== '1'
    ) {
      switchAccountButton.setAttribute(
        LOCKSCREEN_DEFAULT_USERNAME_SWITCH_BOUND_ATTR,
        '1'
      );
      switchAccountButton.addEventListener('click', (event) => {
        event.preventDefault();
        loginInnerForm.setAttribute(LOCKSCREEN_MANUAL_ACCOUNT_MODE_ATTR, '1');
        setLockscreenUsernameInputValue(usernameInput, '');
        syncLockscreenDefaultUsername();
        syncLockscreenTextAvatar();
        usernameInput.focus();
      });
    }

    hideLockscreenUsernameFieldContainer(usernameFieldContainer);
    if (
      usernameRow.parentElement !== usernameFieldContainer.parentElement ||
      usernameRow.previousElementSibling !== usernameFieldContainer
    ) {
      usernameFieldContainer.insertAdjacentElement('afterend', usernameRow);
    }
  }

  function updateLockscreenDefaultUsername(nextUsername) {
    currentLockscreenDefaultUsername = normalizeLockscreenDefaultUsername(
      nextUsername
    );
    const loginInnerForm = document.querySelector('.login-form form');
    if (loginInnerForm instanceof HTMLElement) {
      loginInnerForm.removeAttribute(LOCKSCREEN_MANUAL_ACCOUNT_MODE_ATTR);
    }
    syncLockscreenDefaultUsername();
    syncLockscreenTextAvatar();
  }

  function syncLockscreenTextAvatar() {
    const loginForm = document.querySelector('.login-form');
    if (!(loginForm instanceof HTMLElement)) return;
    const loginInnerForm = loginForm.querySelector('form');
    if (!(loginInnerForm instanceof HTMLElement)) return;

    let avatar = loginInnerForm.querySelector(`.${LOCKSCREEN_TEXT_AVATAR_CLASS}`);
    if (!(avatar instanceof HTMLElement)) {
      avatar = document.createElement('div');
      avatar.className = LOCKSCREEN_TEXT_AVATAR_CLASS;
      avatar.setAttribute('aria-hidden', 'true');
      loginInnerForm.insertBefore(avatar, loginInnerForm.firstChild);
    }

    syncLockscreenAvatarTheme(avatar, loginForm);

    const sourceText = resolveLockscreenAvatarSource(loginForm, loginInnerForm);
    const nextInitial = getLockscreenAvatarInitial(sourceText);
    if (avatar.textContent !== nextInitial) {
      avatar.textContent = nextInitial;
    }

    const usernameInput = loginInnerForm.querySelector(
      'input#username, input[name="username"]'
    );
    if (
      usernameInput instanceof HTMLInputElement &&
      usernameInput.getAttribute(LOCKSCREEN_TEXT_AVATAR_BOUND_ATTR) !== '1'
    ) {
      usernameInput.setAttribute(LOCKSCREEN_TEXT_AVATAR_BOUND_ATTR, '1');
      usernameInput.addEventListener('input', syncLockscreenTextAvatar);
      usernameInput.addEventListener('change', syncLockscreenTextAvatar);
    }
  }

  function isLockscreenView() {
    const loginForm = document.querySelector('.login-form');
    if (!isElementVisiblyRendered(loginForm)) return false;

    // Desktop shell may keep login nodes mounted after login; avoid injecting then.
    if (
      document.querySelector(
        '.trim-ui__app-layout--window, .trim-os__app-layout--files-container'
      ) instanceof HTMLElement
    ) {
      return false;
    }

    return true;
  }

  function updateLockscreenStyleInjection() {
    if (!isInjectionActive) {
      removeElementById(LOCKSCREEN_STYLE_ID);
      return;
    }
    if (isLockscreenView()) {
      injectStyle(LOCKSCREEN_STYLE_ID, 'lockscreen_mod.css');
      syncLoginWallpaperInlineStyle();
      syncLockscreenDefaultUsername();
      syncLockscreenTextAvatar();
      return;
    }
    removeElementById(LOCKSCREEN_STYLE_ID);
  }

  function scheduleLockscreenStyleInjection() {
    if (lockscreenStyleRafId) return;
    lockscreenStyleRafId = window.requestAnimationFrame(() => {
      lockscreenStyleRafId = 0;
      updateLockscreenStyleInjection();
    });
  }

  function startLockscreenStyleSync() {
    if (!lockscreenStyleObserver && document.documentElement) {
      lockscreenStyleObserver = new MutationObserver(() => {
        scheduleLockscreenStyleInjection();
      });
      lockscreenStyleObserver.observe(document.documentElement, {
        subtree: true,
        childList: true
      });
    }

    if (!lockscreenStylePollTimer) {
      lockscreenStylePollTimer = window.setInterval(() => {
        updateLockscreenStyleInjection();
      }, 1200);
    }

    if (hasLockscreenLifecycleHooks) return;
    hasLockscreenLifecycleHooks = true;

    window.addEventListener('load', scheduleLockscreenStyleInjection);
    window.addEventListener('pageshow', scheduleLockscreenStyleInjection);
    window.addEventListener('popstate', scheduleLockscreenStyleInjection);
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        scheduleLockscreenStyleInjection();
      }
    });
  }

  function syncDesktopIconLayoutCss() {
    if (currentDesktopIconLayoutEnabled) {
      injectStyle(DESKTOP_ICON_MOD_STYLE_ID, 'desktop_icon_mod.css');
      return;
    }
    removeElementById(DESKTOP_ICON_MOD_STYLE_ID);
  }

  function injectCustomJs(code) {
    const script = document.createElement('script');
    script.id = CUSTOM_JS_SCRIPT_ID;
    script.type = 'text/javascript';
    script.textContent = code;
    (document.head || document.documentElement).appendChild(script);
  }

  function updateCustomCodeSettings(nextSettings) {
    currentCustomCodeSettings = normalizeCustomCodeSettings(
      nextSettings || currentCustomCodeSettings
    );
    const { enabled, css, js } = currentCustomCodeSettings;

    if (!enabled) {
      removeElementById(CUSTOM_CSS_STYLE_ID);
      removeElementById(CUSTOM_JS_SCRIPT_ID);
      lastAppliedCustomJs = '';
      return;
    }

    if (css) {
      const style = getCustomCssStyleElement();
      style.textContent = css;
    } else {
      removeElementById(CUSTOM_CSS_STYLE_ID);
    }

    if (!js) {
      removeElementById(CUSTOM_JS_SCRIPT_ID);
      lastAppliedCustomJs = '';
      return;
    }

    const shouldReinject =
      js !== lastAppliedCustomJs || !document.getElementById(CUSTOM_JS_SCRIPT_ID);
    if (!shouldReinject) return;

    removeElementById(CUSTOM_JS_SCRIPT_ID);
    injectCustomJs(js);
    lastAppliedCustomJs = js;
  }

  function updateLoginWallpaper() {
    const root = document.documentElement;
    if (!(root instanceof HTMLElement)) return;
    const normalizedWallpaperDataUrl = normalizeLoginWallpaperDataUrl(
      currentLoginWallpaperDataUrl,
      currentLoginWallpaperFileName
    );
    if (!normalizedWallpaperDataUrl) {
      root.style.removeProperty('--fnos-login-wallpaper-url');
      revokeLoginWallpaperObjectUrl();
    } else {
      currentLoginWallpaperDataUrl = normalizedWallpaperDataUrl;
      const resolvedWallpaperUrl = resolveLoginWallpaperUrl(
        normalizedWallpaperDataUrl
      );
      root.style.setProperty(
        '--fnos-login-wallpaper-url',
        `url("${escapeCssString(resolvedWallpaperUrl || normalizedWallpaperDataUrl)}")`
      );
    }
    syncLoginWallpaperInlineStyle();
  }

  function syncLoginWallpaperInlineStyle() {
    const loginForm = document.querySelector('.login-form');
    if (!(loginForm instanceof HTMLElement)) return;

    // fnOS may reset lockscreen inline styles, so keep wallpaper rule pinned here.
    loginForm.style.setProperty(
      'background-image',
      `${LOGIN_WALLPAPER_GRADIENT}, var(--fnos-login-wallpaper-url)`,
      'important'
    );
    loginForm.style.setProperty(
      'background-position',
      'var(--fnos-login-wallpaper-position)',
      'important'
    );
    loginForm.style.setProperty(
      'background-size',
      'var(--fnos-login-wallpaper-size)',
      'important'
    );
    loginForm.style.setProperty('background-repeat', 'no-repeat', 'important');
  }

  async function loadFontAssetFromStorage() {
    try {
      const localState = await chrome.storage.local.get({
        [FONT_LOCAL_DATA_KEY]: '',
        [FONT_LOCAL_NAME_KEY]: '',
        [FONT_LOCAL_FORMAT_KEY]: ''
      });
      currentUploadedFontDataUrl =
        typeof localState[FONT_LOCAL_DATA_KEY] === 'string'
          ? localState[FONT_LOCAL_DATA_KEY]
          : '';
      currentUploadedFontFileName =
        typeof localState[FONT_LOCAL_NAME_KEY] === 'string'
          ? localState[FONT_LOCAL_NAME_KEY]
          : '';
      currentUploadedFontFormat =
        typeof localState[FONT_LOCAL_FORMAT_KEY] === 'string'
          ? localState[FONT_LOCAL_FORMAT_KEY]
          : '';
    } catch (_error) {
      currentUploadedFontDataUrl = '';
      currentUploadedFontFileName = '';
      currentUploadedFontFormat = '';
    }
  }

  async function loadLoginWallpaperFromStorage() {
    try {
      const localState = await chrome.storage.local.get({
        [LOGIN_WALLPAPER_LOCAL_DATA_KEY]: '',
        [LOGIN_WALLPAPER_LOCAL_NAME_KEY]: ''
      });
      currentLoginWallpaperDataUrl =
        typeof localState[LOGIN_WALLPAPER_LOCAL_DATA_KEY] === 'string'
          ? localState[LOGIN_WALLPAPER_LOCAL_DATA_KEY]
          : '';
      currentLoginWallpaperFileName =
        typeof localState[LOGIN_WALLPAPER_LOCAL_NAME_KEY] === 'string'
          ? localState[LOGIN_WALLPAPER_LOCAL_NAME_KEY]
          : '';
    } catch (_error) {
      currentLoginWallpaperDataUrl = '';
      currentLoginWallpaperFileName = '';
    }
  }

  async function loadCustomCodeFromStorage() {
    try {
      const localState = await chrome.storage.local.get({
        [CUSTOM_CSS_LOCAL_KEY]: '',
        [CUSTOM_JS_LOCAL_KEY]: ''
      });
      currentCustomCodeSettings = normalizeCustomCodeSettings({
        enabled: currentCustomCodeSettings.enabled,
        css: localState[CUSTOM_CSS_LOCAL_KEY],
        js: localState[CUSTOM_JS_LOCAL_KEY]
      });
    } catch (_error) {
      currentCustomCodeSettings = normalizeCustomCodeSettings({
        enabled: currentCustomCodeSettings.enabled,
        css: '',
        js: ''
      });
    }
  }

  function injectStyle(id, href) {
    let link = document.getElementById(id);
    if (!link) {
      link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      (document.head || document.documentElement).appendChild(link);
    }

    const nextHref = safeRuntimeGetURL(href);
    if (!nextHref) return;
    if (link.href !== nextHref) {
      link.href = nextHref;
    }
  }

  function injectStyles(titlebarStyle, launchpadStyle, basePresetEnabled = true) {
    const normalizedStyle = normalizeTitlebarStyle(titlebarStyle);
    const normalizedLaunchpadStyle = normalizeLaunchpadStyle(launchpadStyle);
    injectStyle(BASIC_STYLE_ID, 'basic_mod.css');
    syncDesktopIconLayoutCss();
    if (basePresetEnabled) {
      injectStyle(TITLEBAR_STYLE_ID, TITLEBAR_STYLES[normalizedStyle]);
      injectStyle(LAUNCHPAD_STYLE_ID, LAUNCHPAD_STYLES[normalizedLaunchpadStyle]);
      return;
    }
    removeElementById(TITLEBAR_STYLE_ID);
    removeElementById(LAUNCHPAD_STYLE_ID);
  }

  function setBasePresetEnabled(nextEnabled) {
    currentBasePresetEnabled = Boolean(nextEnabled);
    injectStyles(
      currentTitlebarStyle,
      currentLaunchpadStyle,
      currentBasePresetEnabled
    );
    if (currentBasePresetEnabled) return;
    removeElementById(THEME_STYLE_ID);
    clearBrandPaletteInline(document.documentElement);
    clearBrandPaletteInline(document.body);
    clearBrandPaletteInline(document.getElementById('root'));
  }

  function setWindowAnimationBlurEnabled(nextEnabled) {
    currentWindowAnimationBlurEnabled = Boolean(nextEnabled);
    const root = document.documentElement;
    if (!(root instanceof HTMLElement)) return;
    root.classList.toggle(
      WINDOW_ANIMATION_BLUR_DISABLED_CLASS,
      !currentWindowAnimationBlurEnabled
    );
  }

  function injectScript() {
    if (document.getElementById(SCRIPT_ID)) return;

    const scriptUrl = safeRuntimeGetURL('mod.js');
    if (!scriptUrl) return;
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = scriptUrl;
    script.type = 'text/javascript';
    (document.head || document.documentElement).appendChild(script);
  }

  function notifyInjectionTriggered(triggerReason = 'unknown') {
    try {
      if (extensionContextInvalidated) return;
      chrome.runtime.sendMessage({
        type: 'FNOS_INJECTION_TRIGGERED',
        triggerReason,
        origin: ORIGIN,
        href: location.href,
        timestamp: Date.now()
      });
    } catch (error) {
      markContextInvalidated(error);
      // ignore background message failures
    }
  }

  function startInject(
    basePresetEnabled,
    windowAnimationBlurEnabled,
    titlebarStyle,
    launchpadStyle,
    desktopIconLayoutEnabled,
    desktopIconLayoutMode,
    desktopIconPerColumn,
    brandColor,
    fontSettings,
    customCodeSettings,
    lockscreenDefaultUsername,
    launchpadIconScaleEnabled,
    launchpadIconScaleSelectedKeys,
    launchpadIconMaskOnlyKeys,
    launchpadIconRedrawKeys,
    launchpadIconRedrawMap,
    triggerReason = 'unknown'
  ) {
    isInjectionActive = true;
    startLockscreenStyleSync();
    currentTitlebarStyle = normalizeTitlebarStyle(titlebarStyle);
    currentLaunchpadStyle = normalizeLaunchpadStyle(launchpadStyle);
    setBasePresetEnabled(basePresetEnabled);
    // Inject page-context script as early as possible to reduce visual delay.
    injectScript();
    setWindowAnimationBlurEnabled(windowAnimationBlurEnabled);
    updateDesktopIconLayout(
      desktopIconPerColumn,
      desktopIconLayoutMode,
      desktopIconLayoutEnabled
    );
    updateBrandColor(brandColor);
    updateFontSettings(fontSettings || currentFontSettings);
    updateCustomCodeSettings(customCodeSettings || currentCustomCodeSettings);
    updateLockscreenDefaultUsername(lockscreenDefaultUsername);
    updateLoginWallpaper();
    updateLockscreenStyleInjection();
    updateLaunchpadIconScaleEnabled(
      launchpadIconScaleEnabled,
      launchpadIconScaleSelectedKeys,
      launchpadIconMaskOnlyKeys,
      launchpadIconRedrawKeys,
      launchpadIconRedrawMap
    );
    notifyInjectionTriggered(triggerReason);
  }

  function hasFnOSSignature() {
    const hostname = window.location.hostname || '';
    const domainRegex = /(\.fnnas\.cn)$|(\.fnos\.net)$|(\.5ddd\.com)$|(\.fynas\.net)$/i;
    const isKnownFnOSDomain = domainRegex.test(hostname);

    let hasFnOSToken = false;
    try {
      const cookie = document.cookie || '';
      hasFnOSToken =
        cookie.includes('fnos-token') ||
        cookie.includes('fnos-long-token') ||
        Boolean(localStorage.getItem('fnos-token')) ||
        Boolean(localStorage.getItem('fnos-long-token')) ||
        Boolean(sessionStorage.getItem('fnos-token')) ||
        Boolean(sessionStorage.getItem('fnos-long-token'));
    } catch (_error) {
      hasFnOSToken = false;
    }

    const hasFnOSDomMarkers = Boolean(
      document.querySelector('fn-app, [data-fn-id]')
    );

    const hasAppCgiResource = performance
      .getEntriesByType('resource')
      .some((entry) => typeof entry?.name === 'string' && entry.name.includes('/appcgi/'));

    return (
      isKnownFnOSDomain ||
      hasFnOSToken ||
      hasFnOSDomMarkers ||
      hasAppCgiResource
    );
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

  window.addEventListener('message', handleWebsiteVersionRequest);

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === 'FNOS_APPLY') {
      (async () => {
        if (message.refreshFontAsset) {
          await loadFontAssetFromStorage();
        }
        if (message.refreshCustomCode) {
          await loadCustomCodeFromStorage();
        }
        if (message.refreshLoginWallpaper) {
          await loadLoginWallpaperFromStorage();
        }

        startInject(
          message.basePresetEnabled ?? currentBasePresetEnabled,
          message.windowAnimationBlurEnabled ?? currentWindowAnimationBlurEnabled,
          message.titlebarStyle ?? currentTitlebarStyle,
          message.launchpadStyle ?? currentLaunchpadStyle,
          normalizeDesktopIconLayoutEnabled(
            message.desktopIconLayoutEnabled ?? currentDesktopIconLayoutEnabled
          ),
          normalizeDesktopIconLayoutMode(
            message.desktopIconLayoutMode,
            message.desktopIconPerColumnEnabled
          ),
          message.desktopIconPerColumn ?? currentDesktopIconPerColumn,
          message.brandColor ?? currentBrandColor,
          message.fontSettings ?? currentFontSettings,
          message.customCodeSettings ?? currentCustomCodeSettings,
          message.lockscreenDefaultUsername ?? currentLockscreenDefaultUsername,
          message.launchpadIconScaleEnabled ?? currentLaunchpadIconScaleEnabled,
          message.launchpadIconScaleSelectedKeys ??
            currentLaunchpadIconScaleSelectedKeys,
          message.launchpadIconMaskOnlyKeys ??
            currentLaunchpadIconMaskOnlyKeys,
          message.launchpadIconRedrawKeys ?? currentLaunchpadIconRedrawKeys,
          message.launchpadIconRedrawMap ?? currentLaunchpadIconRedrawMap,
          'popup_apply'
        );

        sendResponse({ applied: true });
      })();
      return true;
    }

    if (
      message?.type === 'FNOS_GET_LAUNCHPAD_APP_ITEMS' ||
      message?.type === 'FNOS_GET_LAUNCHPAD_APP_TITLES'
    ) {
      const items = collectLaunchpadAppItems();
      currentLaunchpadAppItems = items;
      window.__fnosLaunchpadAppIconItems = items.map((item) => ({
        key: item.key,
        title: item.title,
        iconSrc: item.iconSrc
      }));
      window.__fnosLaunchpadAppIconTitles = items.map((item) => item.title);
      sendResponse({
        items,
        titles: items.map((item) => item.title)
      });
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

  const fontAssetReady = loadFontAssetFromStorage();
  const loginWallpaperReady = loadLoginWallpaperFromStorage();
  const customCodeReady = loadCustomCodeFromStorage();

  chrome.storage.sync.get(
    {
      enabledOrigins: [],
      autoEnableSuspectedFnOS: true,
      basePresetEnabled: true,
      windowAnimationBlurEnabled: true,
      titlebarStyle: 'windows',
      launchpadStyle: 'classic',
      desktopIconLayoutEnabled: true,
      desktopIconLayoutMode: DESKTOP_ICON_LAYOUT_MODE_DEFAULT,
      desktopIconPerColumnEnabled: null,
      launchpadIconScaleEnabled: false,
      launchpadIconScaleSelectedKeys: [],
      launchpadIconMaskOnlyKeys: [],
      launchpadIconRedrawKeys: [],
      launchpadIconRedrawMap: {},
      desktopIconPerColumn: DESKTOP_ICON_PER_COLUMN_DEFAULT,
      brandColor: THEME_DEFAULT_BRAND,
      fontOverrideEnabled: FONT_DEFAULT_SETTINGS.enabled,
      fontFamily: FONT_DEFAULT_SETTINGS.family,
      fontWeight: FONT_DEFAULT_SETTINGS.weight,
      fontFeatureSettings: FONT_DEFAULT_SETTINGS.featureSettings,
      fontFaceName: FONT_DEFAULT_SETTINGS.faceName,
      fontUrl: FONT_DEFAULT_SETTINGS.url,
      customCodeEnabled: CUSTOM_CODE_DEFAULT_SETTINGS.enabled,
      lockscreenDefaultUsername: ''
    },
    async ({
      enabledOrigins,
      autoEnableSuspectedFnOS,
      basePresetEnabled,
      windowAnimationBlurEnabled,
      titlebarStyle,
      launchpadStyle,
      desktopIconLayoutEnabled,
      desktopIconLayoutMode,
      desktopIconPerColumnEnabled,
      desktopIconPerColumn,
      launchpadIconScaleEnabled,
      launchpadIconScaleSelectedKeys,
      launchpadIconMaskOnlyKeys,
      launchpadIconRedrawKeys,
      launchpadIconRedrawMap,
      brandColor,
      fontOverrideEnabled,
      fontFamily,
      fontWeight,
      fontFeatureSettings,
      fontFaceName,
      fontUrl,
      customCodeEnabled,
      lockscreenDefaultUsername
    }) => {
      await Promise.all([fontAssetReady, loginWallpaperReady, customCodeReady]);

      const isWhitelisted =
        Array.isArray(enabledOrigins) && enabledOrigins.includes(ORIGIN);
      // Whitelisted origins should not wait for signature probing.
      const matchesFnOSUi = isWhitelisted
        ? true
        : await waitForFnOSSignature(1500);
      const autoEnabled = autoEnableSuspectedFnOS && matchesFnOSUi;

      const syncedFontSettings = normalizeFontSettings({
        enabled: fontOverrideEnabled,
        family: fontFamily,
        weight: fontWeight,
        featureSettings: fontFeatureSettings,
        faceName: fontFaceName,
        url: fontUrl
      });
      const syncedCustomCodeSettings = normalizeCustomCodeSettings({
        enabled: customCodeEnabled,
        css: currentCustomCodeSettings.css,
        js: currentCustomCodeSettings.js
      });

      if (isWhitelisted || autoEnabled) {
        const normalizedDesktopIconLayoutEnabled = normalizeDesktopIconLayoutEnabled(
          desktopIconLayoutEnabled
        );
        const normalizedDesktopIconLayoutMode = normalizeDesktopIconLayoutMode(
          desktopIconLayoutMode,
          desktopIconPerColumnEnabled
        );
        startInject(
          basePresetEnabled,
          windowAnimationBlurEnabled,
          titlebarStyle,
          launchpadStyle,
          normalizedDesktopIconLayoutEnabled,
          normalizedDesktopIconLayoutMode,
          desktopIconPerColumn,
          brandColor,
          syncedFontSettings,
          syncedCustomCodeSettings,
          lockscreenDefaultUsername,
          launchpadIconScaleEnabled,
          launchpadIconScaleSelectedKeys,
          launchpadIconMaskOnlyKeys,
          launchpadIconRedrawKeys,
          launchpadIconRedrawMap,
          isWhitelisted ? 'auto_whitelist' : 'auto_suspected'
        );
      } else {
        currentBasePresetEnabled = Boolean(basePresetEnabled);
        currentWindowAnimationBlurEnabled = Boolean(windowAnimationBlurEnabled);
        currentTitlebarStyle = normalizeTitlebarStyle(titlebarStyle);
        currentLaunchpadStyle = normalizeLaunchpadStyle(launchpadStyle);
        currentDesktopIconLayoutEnabled = normalizeDesktopIconLayoutEnabled(
          desktopIconLayoutEnabled
        );
        currentDesktopIconLayoutMode = normalizeDesktopIconLayoutMode(
          desktopIconLayoutMode,
          desktopIconPerColumnEnabled
        );
        currentDesktopIconPerColumn = normalizeDesktopIconPerColumn(
          desktopIconPerColumn
        );
        currentFontSettings = syncedFontSettings;
        currentCustomCodeSettings = syncedCustomCodeSettings;
        currentLockscreenDefaultUsername = normalizeLockscreenDefaultUsername(
          lockscreenDefaultUsername
        );
        currentLaunchpadIconScaleEnabled = Boolean(launchpadIconScaleEnabled);
        const normalizedRedrawMap = normalizeLaunchpadRedrawMap(
          launchpadIconRedrawMap
        );
        currentLaunchpadIconRedrawKeys = normalizeLaunchpadKeyList(
          launchpadIconRedrawKeys
        ).filter((key) => typeof normalizedRedrawMap[key] === 'string');
        currentLaunchpadIconRedrawMap = {};
        currentLaunchpadIconRedrawKeys.forEach((key) => {
          currentLaunchpadIconRedrawMap[key] = normalizedRedrawMap[key];
        });
        const redrawSet = new Set(currentLaunchpadIconRedrawKeys);
        currentLaunchpadIconMaskOnlyKeys = normalizeLaunchpadKeyList(
          launchpadIconMaskOnlyKeys
        ).filter((key) => !redrawSet.has(key));
        currentLaunchpadIconScaleSelectedKeys = normalizeLaunchpadKeyList(
          launchpadIconScaleSelectedKeys
        ).filter((key) => !redrawSet.has(key));
      }
    }
  );

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync') {
      if (changes.basePresetEnabled) {
        const nextBasePresetEnabled = Boolean(changes.basePresetEnabled.newValue);
        if (!isInjectionActive) {
          currentBasePresetEnabled = nextBasePresetEnabled;
        } else {
          setBasePresetEnabled(nextBasePresetEnabled);
          if (nextBasePresetEnabled) {
            updateBrandColor(currentBrandColor);
          }
        }
      }

      if (changes.titlebarStyle || changes.launchpadStyle) {
        currentTitlebarStyle = changes.titlebarStyle
          ? normalizeTitlebarStyle(changes.titlebarStyle.newValue)
          : currentTitlebarStyle;
        currentLaunchpadStyle = changes.launchpadStyle
          ? normalizeLaunchpadStyle(changes.launchpadStyle.newValue)
          : currentLaunchpadStyle;
        if (isInjectionActive) {
          injectStyles(
            currentTitlebarStyle,
            currentLaunchpadStyle,
            currentBasePresetEnabled
          );
        }
      }

      if (changes.windowAnimationBlurEnabled) {
        const nextWindowAnimationBlurEnabled = Boolean(
          changes.windowAnimationBlurEnabled.newValue
        );
        if (!isInjectionActive) {
          currentWindowAnimationBlurEnabled = nextWindowAnimationBlurEnabled;
        } else {
          setWindowAnimationBlurEnabled(nextWindowAnimationBlurEnabled);
        }
      }

      if (changes.desktopIconLayoutMode) {
        const nextDesktopIconLayoutMode = normalizeDesktopIconLayoutMode(
          changes.desktopIconLayoutMode.newValue
        );
        if (!isInjectionActive) {
          currentDesktopIconLayoutMode = nextDesktopIconLayoutMode;
        } else {
          updateDesktopIconLayout(
            currentDesktopIconPerColumn,
            nextDesktopIconLayoutMode,
            currentDesktopIconLayoutEnabled
          );
        }
      }
      if (changes.desktopIconLayoutEnabled) {
        const nextDesktopIconLayoutEnabled = normalizeDesktopIconLayoutEnabled(
          changes.desktopIconLayoutEnabled.newValue
        );
        if (!isInjectionActive) {
          currentDesktopIconLayoutEnabled = nextDesktopIconLayoutEnabled;
        } else {
          updateDesktopIconLayout(
            currentDesktopIconPerColumn,
            currentDesktopIconLayoutMode,
            nextDesktopIconLayoutEnabled
          );
        }
      }
      if (
        changes.desktopIconPerColumnEnabled &&
        !changes.desktopIconLayoutMode
      ) {
        const nextDesktopIconLayoutMode = normalizeDesktopIconLayoutMode(
          undefined,
          changes.desktopIconPerColumnEnabled.newValue
        );
        if (!isInjectionActive) {
          currentDesktopIconLayoutMode = nextDesktopIconLayoutMode;
        } else {
          updateDesktopIconLayout(
            currentDesktopIconPerColumn,
            nextDesktopIconLayoutMode,
            currentDesktopIconLayoutEnabled
          );
        }
      }

      if (changes.brandColor) {
        if (!isInjectionActive) {
          const normalized = normalizeHex(changes.brandColor.newValue) || THEME_DEFAULT_BRAND;
          currentBrandColor = clampBrandLightness(normalized);
        } else {
          updateBrandColor(changes.brandColor.newValue);
        }
      }

      if (changes.desktopIconPerColumn) {
        const nextDesktopIconPerColumn = normalizeDesktopIconPerColumn(
          changes.desktopIconPerColumn.newValue
        );
        if (!isInjectionActive) {
          currentDesktopIconPerColumn = nextDesktopIconPerColumn;
        } else {
          updateDesktopIconLayout(
            nextDesktopIconPerColumn,
            currentDesktopIconLayoutMode,
            currentDesktopIconLayoutEnabled
          );
        }
      }

      const hasFontChange =
        changes.fontOverrideEnabled ||
        changes.fontFamily ||
        changes.fontWeight ||
        changes.fontFeatureSettings ||
        changes.fontFaceName ||
        changes.fontUrl;

      if (hasFontChange) {
        const nextFontSettings = {
          enabled: changes.fontOverrideEnabled
            ? changes.fontOverrideEnabled.newValue
            : currentFontSettings.enabled,
          family: changes.fontFamily
            ? changes.fontFamily.newValue
            : currentFontSettings.family,
          weight: changes.fontWeight
            ? changes.fontWeight.newValue
            : currentFontSettings.weight,
          featureSettings: changes.fontFeatureSettings
            ? changes.fontFeatureSettings.newValue
            : currentFontSettings.featureSettings,
          faceName: changes.fontFaceName
            ? changes.fontFaceName.newValue
            : currentFontSettings.faceName,
          url: changes.fontUrl ? changes.fontUrl.newValue : currentFontSettings.url
        };
        if (!isInjectionActive) {
          currentFontSettings = normalizeFontSettings(nextFontSettings);
        } else {
          updateFontSettings(nextFontSettings);
        }
      }

      if (changes.customCodeEnabled) {
        const nextCustomCodeSettings = {
          enabled: changes.customCodeEnabled.newValue,
          css: currentCustomCodeSettings.css,
          js: currentCustomCodeSettings.js
        };
        if (!isInjectionActive) {
          currentCustomCodeSettings = normalizeCustomCodeSettings(nextCustomCodeSettings);
        } else {
          updateCustomCodeSettings(nextCustomCodeSettings);
        }
      }

      if (changes.lockscreenDefaultUsername) {
        if (!isInjectionActive) {
          currentLockscreenDefaultUsername = normalizeLockscreenDefaultUsername(
            changes.lockscreenDefaultUsername.newValue
          );
        } else {
          updateLockscreenDefaultUsername(
            changes.lockscreenDefaultUsername.newValue
          );
        }
      }

      if (
        changes.launchpadIconScaleEnabled ||
        changes.launchpadIconScaleSelectedKeys ||
        changes.launchpadIconMaskOnlyKeys ||
        changes.launchpadIconRedrawKeys ||
        changes.launchpadIconRedrawMap
      ) {
        const nextEnabled = changes.launchpadIconScaleEnabled
          ? Boolean(changes.launchpadIconScaleEnabled.newValue)
          : currentLaunchpadIconScaleEnabled;
        const nextSelectedKeys = changes.launchpadIconScaleSelectedKeys
          ? changes.launchpadIconScaleSelectedKeys.newValue
          : currentLaunchpadIconScaleSelectedKeys;
        const nextMaskOnlyKeys = changes.launchpadIconMaskOnlyKeys
          ? changes.launchpadIconMaskOnlyKeys.newValue
          : currentLaunchpadIconMaskOnlyKeys;
        const nextRedrawKeys = changes.launchpadIconRedrawKeys
          ? changes.launchpadIconRedrawKeys.newValue
          : currentLaunchpadIconRedrawKeys;
        const nextRedrawMap = changes.launchpadIconRedrawMap
          ? changes.launchpadIconRedrawMap.newValue
          : currentLaunchpadIconRedrawMap;
        if (!isInjectionActive) {
          currentLaunchpadIconScaleEnabled = nextEnabled;
          const normalizedRedrawMap = normalizeLaunchpadRedrawMap(nextRedrawMap);
          currentLaunchpadIconRedrawKeys = normalizeLaunchpadKeyList(
            nextRedrawKeys
          ).filter((key) => typeof normalizedRedrawMap[key] === 'string');
          currentLaunchpadIconRedrawMap = {};
          currentLaunchpadIconRedrawKeys.forEach((key) => {
            currentLaunchpadIconRedrawMap[key] = normalizedRedrawMap[key];
          });
          const redrawSet = new Set(currentLaunchpadIconRedrawKeys);
          currentLaunchpadIconMaskOnlyKeys = normalizeLaunchpadKeyList(
            nextMaskOnlyKeys
          ).filter((key) => !redrawSet.has(key));
          currentLaunchpadIconScaleSelectedKeys = normalizeLaunchpadKeyList(
            nextSelectedKeys
          ).filter((key) => !redrawSet.has(key));
        } else {
          updateLaunchpadIconScaleEnabled(
            nextEnabled,
            nextSelectedKeys,
            nextMaskOnlyKeys,
            nextRedrawKeys,
            nextRedrawMap
          );
        }
      }
      return;
    }

    if (area !== 'local') return;

    if (changes[FONT_LOCAL_DATA_KEY]) {
      currentUploadedFontDataUrl =
        typeof changes[FONT_LOCAL_DATA_KEY].newValue === 'string'
          ? changes[FONT_LOCAL_DATA_KEY].newValue
          : '';
    }
    if (changes[FONT_LOCAL_NAME_KEY]) {
      currentUploadedFontFileName =
        typeof changes[FONT_LOCAL_NAME_KEY].newValue === 'string'
          ? changes[FONT_LOCAL_NAME_KEY].newValue
          : '';
    }
    if (changes[FONT_LOCAL_FORMAT_KEY]) {
      currentUploadedFontFormat =
        typeof changes[FONT_LOCAL_FORMAT_KEY].newValue === 'string'
          ? changes[FONT_LOCAL_FORMAT_KEY].newValue
          : '';
    }
    if (changes[LOGIN_WALLPAPER_LOCAL_DATA_KEY]) {
      currentLoginWallpaperDataUrl =
        typeof changes[LOGIN_WALLPAPER_LOCAL_DATA_KEY].newValue === 'string'
          ? changes[LOGIN_WALLPAPER_LOCAL_DATA_KEY].newValue
          : '';
    }
    if (changes[LOGIN_WALLPAPER_LOCAL_NAME_KEY]) {
      currentLoginWallpaperFileName =
        typeof changes[LOGIN_WALLPAPER_LOCAL_NAME_KEY].newValue === 'string'
          ? changes[LOGIN_WALLPAPER_LOCAL_NAME_KEY].newValue
          : '';
    }
    if (changes[CUSTOM_CSS_LOCAL_KEY]) {
      currentCustomCodeSettings = normalizeCustomCodeSettings({
        enabled: currentCustomCodeSettings.enabled,
        css: changes[CUSTOM_CSS_LOCAL_KEY].newValue,
        js: currentCustomCodeSettings.js
      });
    }
    if (changes[CUSTOM_JS_LOCAL_KEY]) {
      currentCustomCodeSettings = normalizeCustomCodeSettings({
        enabled: currentCustomCodeSettings.enabled,
        css: currentCustomCodeSettings.css,
        js: changes[CUSTOM_JS_LOCAL_KEY].newValue
      });
    }

    if (
      changes[FONT_LOCAL_DATA_KEY] ||
      changes[FONT_LOCAL_NAME_KEY] ||
      changes[FONT_LOCAL_FORMAT_KEY]
    ) {
      if (!isInjectionActive) return;
      updateFontSettings(currentFontSettings);
    }
    if (
      changes[LOGIN_WALLPAPER_LOCAL_DATA_KEY] ||
      changes[LOGIN_WALLPAPER_LOCAL_NAME_KEY]
    ) {
      if (!isInjectionActive) return;
      updateLoginWallpaper();
    }
    if (changes[CUSTOM_CSS_LOCAL_KEY] || changes[CUSTOM_JS_LOCAL_KEY]) {
      if (!isInjectionActive) return;
      updateCustomCodeSettings(currentCustomCodeSettings);
    }
  });

  window.addEventListener('unload', () => {
    revokeLoginWallpaperObjectUrl();
  });
})();
