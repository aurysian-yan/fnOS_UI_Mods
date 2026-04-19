import { useEffect, useRef, useState } from "react";
import {
  ACTION_BADGE_TEXT,
  CUSTOM_CSS_LOCAL_KEY,
  CUSTOM_JS_LOCAL_KEY,
  CUSTOM_CODE_STATUS_DEFAULT,
  DEFAULT_BRAND_COLOR,
  DEFAULT_CUSTOM_CODE_SETTINGS,
  DEFAULT_FONT_SETTINGS,
  DESKTOP_ICON_LAYOUT_MODE_DEFAULT,
  DESKTOP_ICON_PER_COLUMN_DEFAULT,
  GITHUB_COMMITS_API_URL,
  GITHUB_COMMITS_PAGE_URL,
  INITIAL_POPUP_STATE,
  LOGIN_WALLPAPER_LOCAL_DATA_KEY,
  LOGIN_WALLPAPER_LOCAL_NAME_KEY,
  UPDATE_CHECK_INTERVAL_MS,
  UPDATE_STATE_LOCAL_KEY
} from "../lib/constants";
import {
  buildLaunchpadRedrawMapFromSelection,
  isSameStringArray,
  loadPrefectIconMap,
  normalizeLaunchpadAppItems,
  normalizeLaunchpadKeyList,
  normalizeLaunchpadRedrawMap,
  resolveLaunchpadItems
} from "../lib/launchpad";
import {
  buildLoginWallpaperStatus,
  clampBrandLightness,
  getReadableTextColor,
  hexToRgb,
  getCustomCodeStatusText,
  isStorageQuotaErrorMessage,
  normalizeCustomCodeSettings,
  normalizeDesktopIconLayoutMode,
  normalizeDesktopIconPerColumn,
  normalizeFontSettings,
  normalizeLockscreenDefaultUsername,
  normalizeText,
  normalizeUpdateState,
  parseUpdateErrorMessage,
  readFileAsDataUrl
} from "../lib/utils";
import type {
  CustomCodeSettings,
  FontSettings,
  LaunchpadStyle,
  PopupState,
  TitlebarStyle,
  UpdateState
} from "../types";

export function usePopupController() {
  const [state, setState] = useState(INITIAL_POPUP_STATE);
  const stateRef = useRef<PopupState>(INITIAL_POPUP_STATE);
  const activeTabIdRef = useRef<number | null>(null);
  const originRef = useRef("");
  const enabledOriginsRef = useRef<string[]>([]);
  const loginWallpaperDataUrlRef = useRef("");
  const loginWallpaperFileNameRef = useRef("");
  const updateCheckInFlightRef = useRef<Promise<UpdateState> | null>(null);
  const prefectIconMapRef = useRef<Awaited<ReturnType<typeof loadPrefectIconMap>> | null>(null);
  const launchpadAvailabilityRef = useRef(new Map<string, any>());
  const launchpadResourceCacheRef = useRef(new Map<string, Promise<boolean>>());
  const launchpadRedrawMapRef = useRef<Record<string, string>>({});

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const root = document.documentElement;
    const brandRgb = hexToRgb(state.brandColor) ?? { r: 0, g: 102, b: 255 };
    root.style.setProperty("--brand", state.brandColor);
    root.style.setProperty("--brand-rgb", `${brandRgb.r} ${brandRgb.g} ${brandRgb.b}`);
    root.style.setProperty("--brand-contrast", getReadableTextColor(state.brandColor));
  }, [state.brandColor]);

  function mergeState(patch: Partial<PopupState>) {
    setState((current) => {
      const next = { ...current, ...patch };
      stateRef.current = next;
      return next;
    });
  }

  async function safeSyncSet(data: Record<string, unknown>) {
    try {
      await chrome.storage.sync.set(data);
      return true;
    } catch (error) {
      if (typeof (error as Error | undefined)?.message === "string") {
        console.warn("[FnOS UI Mods] 同步存储写入失败:", (error as Error).message);
      }
      return false;
    }
  }

  async function safeLocalSet(data: Record<string, unknown>) {
    try {
      await chrome.storage.local.set(data);
      return { ok: true, message: "", isQuota: false };
    } catch (error) {
      const message =
        typeof (error as Error | undefined)?.message === "string"
          ? (error as Error).message
          : "unknown-error";
      return {
        ok: false,
        message,
        isQuota: isStorageQuotaErrorMessage(message)
      };
    }
  }

  async function safeLocalRemove(keys: string[]) {
    try {
      await chrome.storage.local.remove(keys);
      return true;
    } catch (error) {
      if (typeof (error as Error | undefined)?.message === "string") {
        console.warn("[FnOS UI Mods] 本地存储删除失败:", (error as Error).message);
      }
      return false;
    }
  }

  async function applyToCurrentTabIfNeeded(options?: {
    refreshFontAsset?: boolean;
    refreshCustomCode?: boolean;
    refreshLoginWallpaper?: boolean;
  }) {
    const current = stateRef.current;
    const shouldInject =
      current.siteEnabled || (current.autoEnableSuspectedFnOS && current.isFnOSWebUi);

    if (!shouldInject || !activeTabIdRef.current) return;

    try {
      await chrome.tabs.sendMessage(activeTabIdRef.current, {
        type: "FNOS_APPLY",
        basePresetEnabled: current.basePresetEnabled,
        windowAnimationBlurEnabled: current.windowAnimationBlurEnabled,
        titlebarStyle: current.titlebarStyle,
        launchpadStyle: current.launchpadStyle,
        desktopIconLayoutEnabled: current.desktopIconLayoutEnabled,
        desktopIconLayoutMode: current.desktopIconLayoutMode,
        launchpadIconScaleEnabled: current.launchpadIconScaleEnabled,
        launchpadIconScaleSelectedKeys: current.launchpadIconScaleSelectedKeys,
        launchpadIconMaskOnlyKeys: current.launchpadIconMaskOnlyKeys,
        launchpadIconRedrawKeys: current.launchpadIconRedrawKeys,
        launchpadIconRedrawMap: buildLaunchpadRedrawMapFromSelection(
          current.launchpadIconRedrawKeys,
          launchpadAvailabilityRef.current,
          launchpadRedrawMapRef.current
        ),
        desktopIconPerColumn: current.desktopIconPerColumn,
        brandColor: current.brandColor,
        fontSettings: current.fontSettings,
        customCodeSettings: current.customCodeSettings,
        lockscreenDefaultUsername: current.lockscreenDefaultUsername,
        refreshFontAsset: Boolean(options?.refreshFontAsset),
        refreshCustomCode: Boolean(options?.refreshCustomCode),
        refreshLoginWallpaper: Boolean(options?.refreshLoginWallpaper)
      });
    } catch {
      // ignore
    }
  }

  async function syncActionBadge(updateState: UpdateState) {
    if (!chrome?.action?.setBadgeText) return;
    const hasUpdate = Boolean(updateState.hasUpdate);
    try {
      await chrome.action.setBadgeText({
        text: hasUpdate ? ACTION_BADGE_TEXT : ""
      });
      if (hasUpdate && chrome.action.setBadgeBackgroundColor) {
        await chrome.action.setBadgeBackgroundColor({
          color: "#ff6633"
        });
      }
    } catch {
      // ignore
    }
  }

  async function fetchLatestCommit() {
    const response = await fetch(GITHUB_COMMITS_API_URL, {
      headers: { Accept: "application/vnd.github+json" }
    });
    if (!response.ok) {
      throw new Error(`http-${response.status}`);
    }
    const data = await response.json();
    const latest = Array.isArray(data) ? data[0] : null;
    if (!latest || typeof latest !== "object" || typeof latest.sha !== "string") {
      throw new Error("invalid-response");
    }
    const firstLine = String(latest?.commit?.message || "").split("\n")[0];
    return {
      sha: latest.sha,
      date:
        normalizeText(latest?.commit?.committer?.date, 80) ||
        normalizeText(latest?.commit?.author?.date, 80),
      url: normalizeText(latest?.html_url, 1000) || GITHUB_COMMITS_PAGE_URL,
      message: normalizeText(firstLine, 200)
    };
  }

  async function checkForUpdates(force = false) {
    if (updateCheckInFlightRef.current) {
      return updateCheckInFlightRef.current;
    }

    const current = stateRef.current;
    const manifestVersion = current.manifestVersion;
    let updateState = { ...current.updateState };

    if (updateState.baseVersion !== manifestVersion) {
      updateState = {
        ...updateState,
        baseVersion: manifestVersion,
        baseSha: "",
        hasUpdate: false
      };
    }

    const isFresh =
      !force &&
      updateState.lastCheckedAt > 0 &&
      Date.now() - updateState.lastCheckedAt < UPDATE_CHECK_INTERVAL_MS &&
      updateState.lastResult !== "error";

    if (isFresh) {
      return updateState;
    }

    mergeState({ isUpdateChecking: true });

    const promise = (async () => {
      let nextState = updateState;
      try {
        const latest = await fetchLatestCommit();
        const baseSha = normalizeText(updateState.baseSha, 128);
        const hasBase = Boolean(baseSha);
        const hasUpdate = hasBase && latest.sha !== baseSha;
        const nextBaseSha = hasBase ? baseSha : latest.sha;
        nextState = {
          ...updateState,
          baseVersion: manifestVersion,
          baseSha: nextBaseSha,
          lastCheckedAt: Date.now(),
          latestSha: latest.sha,
          latestDate: latest.date,
          latestUrl: latest.url,
          latestMessage: latest.message,
          hasUpdate,
          lastResult: hasUpdate ? "new" : hasBase ? "same" : "first",
          lastError: ""
        };
      } catch (error) {
        nextState = {
          ...updateState,
          lastCheckedAt: Date.now(),
          lastResult: "error",
          lastError: parseUpdateErrorMessage(error)
        };
      }

      await safeLocalSet({ [UPDATE_STATE_LOCAL_KEY]: nextState });
      mergeState({ updateState: nextState, isUpdateChecking: false });
      await syncActionBadge(nextState);
      return nextState;
    })().finally(() => {
      updateCheckInFlightRef.current = null;
      mergeState({ isUpdateChecking: false });
    });

    updateCheckInFlightRef.current = promise;
    return promise;
  }

  async function persistLaunchpadSelections(next: {
    launchpadIconScaleSelectedKeys: string[];
    launchpadIconMaskOnlyKeys: string[];
    launchpadIconRedrawKeys: string[];
  }) {
    const redrawMap = buildLaunchpadRedrawMapFromSelection(
      next.launchpadIconRedrawKeys,
      launchpadAvailabilityRef.current,
      launchpadRedrawMapRef.current
    );
    launchpadRedrawMapRef.current = redrawMap;
    await safeSyncSet({
      launchpadIconScaleSelectedKeys: next.launchpadIconScaleSelectedKeys,
      launchpadIconMaskOnlyKeys: next.launchpadIconMaskOnlyKeys,
      launchpadIconRedrawKeys: next.launchpadIconRedrawKeys,
      launchpadIconRedrawMap: redrawMap
    });
  }

  function buildLaunchpadStatus(items: PopupState["launchpadItems"], stateValue = stateRef.current) {
    const scaleSelectedSet = new Set(stateValue.launchpadIconScaleSelectedKeys);
    const maskOnlySelectedSet = new Set(stateValue.launchpadIconMaskOnlyKeys);
    const redrawSelectedSet = new Set(stateValue.launchpadIconRedrawKeys);
    const scaleCount = items.filter((item) => scaleSelectedSet.has(item.key)).length;
    const maskCount = items.filter((item) => maskOnlySelectedSet.has(item.key)).length;
    const redrawCount = items.filter((item) => redrawSelectedSet.has(item.key)).length;
    return `应用列表：共 ${items.length} 项，缩放 ${scaleCount} 项，蒙版 ${maskCount} 项，重绘 ${redrawCount} 项`;
  }

  async function refreshLaunchpadAppList() {
    const current = stateRef.current;
    if (!activeTabIdRef.current) return;
    if (!current.isFnOSWebUi) {
      mergeState({
        launchpadItems: [],
        launchpadAppListStatus: "应用列表：当前页面未检测为 fnOS WebUI"
      });
      return;
    }

    try {
      if (!prefectIconMapRef.current) {
        prefectIconMapRef.current = await loadPrefectIconMap();
      }

      const response = await chrome.tabs.sendMessage(activeTabIdRef.current, {
        type: "FNOS_GET_LAUNCHPAD_APP_ITEMS"
      });

      const fallbackItems = Array.isArray(response?.titles)
        ? response.titles.map((title: string) => ({
            title,
            key: String(title || "").trim(),
            iconSrc: ""
          }))
        : [];

      const sourceItems = normalizeLaunchpadAppItems(response?.items || fallbackItems);

      if (!sourceItems.length) {
        mergeState({
          launchpadItems: [],
          launchpadAppListStatus: "应用列表：未读取到应用，先打开启动台再试"
        });
        return;
      }

      const { items, availabilityByKey } = await resolveLaunchpadItems(
        sourceItems,
        prefectIconMapRef.current,
        launchpadResourceCacheRef.current
      );

      launchpadAvailabilityRef.current = availabilityByKey;

      const availableSet = new Set(items.map((item) => item.key));
      const availableRedrawSet = new Set(items.filter((item) => item.redrawAvailable).map((item) => item.key));

      const nextRedraw = normalizeLaunchpadKeyList(current.launchpadIconRedrawKeys).filter(
        (key) => availableSet.has(key) && availableRedrawSet.has(key)
      );
      const redrawSet = new Set(nextRedraw);
      const nextMaskOnly = normalizeLaunchpadKeyList(current.launchpadIconMaskOnlyKeys).filter(
        (key) => availableSet.has(key) && !redrawSet.has(key)
      );
      const nextSelected = normalizeLaunchpadKeyList(current.launchpadIconScaleSelectedKeys).filter(
        (key) => availableSet.has(key) && !redrawSet.has(key)
      );

      const hasSelectionChanged = !isSameStringArray(nextSelected, current.launchpadIconScaleSelectedKeys);
      const hasMaskOnlyChanged = !isSameStringArray(nextMaskOnly, current.launchpadIconMaskOnlyKeys);
      const hasRedrawChanged = !isSameStringArray(nextRedraw, current.launchpadIconRedrawKeys);

      const nextState: Partial<PopupState> = {
        launchpadItems: items,
        launchpadIconScaleSelectedKeys: nextSelected,
        launchpadIconMaskOnlyKeys: nextMaskOnly,
        launchpadIconRedrawKeys: nextRedraw
      };
      const nextMergedState = { ...current, ...nextState };
      nextState.launchpadAppListStatus = buildLaunchpadStatus(items, nextMergedState);
      mergeState(nextState);

      if (hasSelectionChanged || hasMaskOnlyChanged || hasRedrawChanged) {
        await persistLaunchpadSelections({
          launchpadIconScaleSelectedKeys: nextSelected,
          launchpadIconMaskOnlyKeys: nextMaskOnly,
          launchpadIconRedrawKeys: nextRedraw
        });
      }
    } catch {
      mergeState({
        launchpadItems: [],
        launchpadAppListStatus: "应用列表：读取失败，请刷新页面后重试"
      });
    }
  }

  useEffect(() => {
    void (async () => {
      const manifestVersion = String(chrome.runtime.getManifest().version || "");
      const localUpdateState = await chrome.storage.local.get({
        [UPDATE_STATE_LOCAL_KEY]: null
      });

      mergeState({
        manifestVersion,
        updateState: normalizeUpdateState(localUpdateState[UPDATE_STATE_LOCAL_KEY], manifestVersion)
      });

      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      activeTabIdRef.current = typeof tab?.id === "number" ? tab.id : null;

      const pageUrl = tab?.url ? new URL(tab.url) : null;
      const origin = pageUrl?.origin || "";
      originRef.current = origin;

      if (!pageUrl || !origin || !/^https?:$/.test(pageUrl.protocol)) {
        mergeState({
          originText: "当前页不是 http/https 页面",
          isHttpPage: false,
          isInitializing: false,
          launchpadItems: [],
          launchpadAppListStatus: "应用列表：当前页不是 http/https 页面"
        });
        await checkForUpdates(false);
        return;
      }

      let isFnOSWebUi = false;
      try {
        const response = await chrome.tabs.sendMessage(activeTabIdRef.current!, {
          type: "FNOS_CHECK",
          wait: true
        });
        isFnOSWebUi = Boolean(response?.isFnOSWebUi);
      } catch {
        isFnOSWebUi = false;
      }

      const syncState = await chrome.storage.sync.get({
        enabledOrigins: [],
        autoEnableSuspectedFnOS: true,
        basePresetEnabled: true,
        windowAnimationBlurEnabled: true,
        titlebarStyle: "windows",
        launchpadStyle: "classic",
        desktopIconLayoutEnabled: true,
        desktopIconLayoutMode: DESKTOP_ICON_LAYOUT_MODE_DEFAULT,
        desktopIconPerColumnEnabled: null,
        launchpadIconScaleEnabled: false,
        launchpadIconScaleSelectedKeys: [],
        launchpadIconMaskOnlyKeys: [],
        launchpadIconRedrawKeys: [],
        launchpadIconRedrawMap: {},
        desktopIconPerColumn: DESKTOP_ICON_PER_COLUMN_DEFAULT,
        brandColor: DEFAULT_BRAND_COLOR,
        fontOverrideEnabled: DEFAULT_FONT_SETTINGS.enabled,
        fontFamily: DEFAULT_FONT_SETTINGS.family,
        fontMonospaceFamily: DEFAULT_FONT_SETTINGS.monospaceFamily,
        fontWeight: DEFAULT_FONT_SETTINGS.weight,
        fontFeatureSettings: DEFAULT_FONT_SETTINGS.featureSettings,
        fontFaceName: DEFAULT_FONT_SETTINGS.faceName,
        fontUrl: DEFAULT_FONT_SETTINGS.url,
        customCodeEnabled: DEFAULT_CUSTOM_CODE_SETTINGS.enabled,
        lockscreenDefaultUsername: ""
      });

      const localState = await chrome.storage.local.get({
        [LOGIN_WALLPAPER_LOCAL_DATA_KEY]: "",
        [LOGIN_WALLPAPER_LOCAL_NAME_KEY]: "",
        [CUSTOM_CSS_LOCAL_KEY]: "",
        [CUSTOM_JS_LOCAL_KEY]: ""
      });

      enabledOriginsRef.current = Array.isArray(syncState.enabledOrigins)
        ? syncState.enabledOrigins
        : [];

      loginWallpaperDataUrlRef.current =
        typeof localState[LOGIN_WALLPAPER_LOCAL_DATA_KEY] === "string"
          ? localState[LOGIN_WALLPAPER_LOCAL_DATA_KEY]
          : "";
      loginWallpaperFileNameRef.current =
        typeof localState[LOGIN_WALLPAPER_LOCAL_NAME_KEY] === "string"
          ? localState[LOGIN_WALLPAPER_LOCAL_NAME_KEY]
          : "";

      const brandColor = clampBrandLightness(syncState.brandColor);
      const nextRedrawKeys = normalizeLaunchpadKeyList(syncState.launchpadIconRedrawKeys);
      const nextRedrawSet = new Set(nextRedrawKeys);
      const nextScaleKeys = normalizeLaunchpadKeyList(syncState.launchpadIconScaleSelectedKeys).filter(
        (key) => !nextRedrawSet.has(key)
      );
      const nextMaskOnlyKeys = normalizeLaunchpadKeyList(syncState.launchpadIconMaskOnlyKeys).filter(
        (key) => !nextRedrawSet.has(key)
      );
      launchpadRedrawMapRef.current = normalizeLaunchpadRedrawMap(syncState.launchpadIconRedrawMap);

      const fontSettings = normalizeFontSettings({
        enabled: syncState.fontOverrideEnabled,
        family: syncState.fontFamily,
        monospaceFamily: syncState.fontMonospaceFamily,
        weight: syncState.fontWeight,
        featureSettings: syncState.fontFeatureSettings,
        faceName: syncState.fontFaceName,
        url: syncState.fontUrl
      });
      const customCodeSettings = normalizeCustomCodeSettings({
        enabled: syncState.customCodeEnabled,
        css: localState[CUSTOM_CSS_LOCAL_KEY],
        js: localState[CUSTOM_JS_LOCAL_KEY]
      });
      const lockscreenDefaultUsername = normalizeLockscreenDefaultUsername(
        syncState.lockscreenDefaultUsername
      );

      mergeState({
        originText: origin,
        isHttpPage: true,
        isFnOSWebUi,
        siteEnabled: enabledOriginsRef.current.includes(origin),
        autoEnableSuspectedFnOS: Boolean(syncState.autoEnableSuspectedFnOS),
        basePresetEnabled: Boolean(syncState.basePresetEnabled),
        windowAnimationBlurEnabled:
          typeof syncState.windowAnimationBlurEnabled === "boolean"
            ? syncState.windowAnimationBlurEnabled
            : true,
        titlebarStyle: syncState.titlebarStyle === "mac" ? "mac" : "windows",
        launchpadStyle: syncState.launchpadStyle === "spotlight" ? "spotlight" : "classic",
        desktopIconLayoutEnabled:
          typeof syncState.desktopIconLayoutEnabled === "boolean"
            ? syncState.desktopIconLayoutEnabled
            : true,
        desktopIconLayoutMode: normalizeDesktopIconLayoutMode(
          syncState.desktopIconLayoutMode,
          syncState.desktopIconPerColumnEnabled
        ),
        desktopIconPerColumn: normalizeDesktopIconPerColumn(syncState.desktopIconPerColumn),
        launchpadIconScaleEnabled: Boolean(syncState.launchpadIconScaleEnabled),
        launchpadIconScaleSelectedKeys: nextScaleKeys,
        launchpadIconMaskOnlyKeys: nextMaskOnlyKeys,
        launchpadIconRedrawKeys: nextRedrawKeys,
        brandColor,
        fontSettings,
        customCodeSettings,
        customCodeStatus: getCustomCodeStatusText(),
        loginWallpaperStatus: buildLoginWallpaperStatus(
          loginWallpaperDataUrlRef.current,
          loginWallpaperFileNameRef.current
        ),
        lockscreenDefaultUsername,
        isInitializing: false
      });

      await refreshLaunchpadAppList();
      await checkForUpdates(false);
    })();
  }, []);

  async function setSiteEnabled(checked: boolean) {
    const origin = originRef.current;
    if (!origin) return;
    const enabledOrigins = checked
      ? [...new Set([...enabledOriginsRef.current, origin])]
      : enabledOriginsRef.current.filter((item) => item !== origin);
    enabledOriginsRef.current = enabledOrigins;
    mergeState({ siteEnabled: checked });
    await safeSyncSet({ enabledOrigins });
    await applyToCurrentTabIfNeeded();
  }

  async function setAutoEnableSuspectedFnOS(checked: boolean) {
    mergeState({ autoEnableSuspectedFnOS: checked });
    await safeSyncSet({ autoEnableSuspectedFnOS: checked });
    await applyToCurrentTabIfNeeded();
  }

  async function setBasePresetEnabled(checked: boolean) {
    mergeState({ basePresetEnabled: checked });
    await safeSyncSet({ basePresetEnabled: checked });
    await applyToCurrentTabIfNeeded();
  }

  function previewBrandColor(value: string) {
    mergeState({ brandColor: clampBrandLightness(value) });
  }

  async function commitBrandColor(value: string) {
    const brandColor = clampBrandLightness(value);
    mergeState({ brandColor });
    await safeSyncSet({ brandColor });
    await applyToCurrentTabIfNeeded();
  }

  async function resetBrandColor() {
    await commitBrandColor(DEFAULT_BRAND_COLOR);
  }

  async function setWindowAnimationBlurEnabled(checked: boolean) {
    mergeState({ windowAnimationBlurEnabled: checked });
    await safeSyncSet({ windowAnimationBlurEnabled: checked });
    await applyToCurrentTabIfNeeded();
  }

  async function setTitlebarStyle(value: TitlebarStyle) {
    mergeState({ titlebarStyle: value });
    await safeSyncSet({ titlebarStyle: value });
    await applyToCurrentTabIfNeeded();
  }

  async function setLaunchpadStyle(value: LaunchpadStyle) {
    mergeState({ launchpadStyle: value });
    await safeSyncSet({ launchpadStyle: value });
    await applyToCurrentTabIfNeeded();
    await refreshLaunchpadAppList();
  }

  async function setDesktopIconLayoutEnabled(checked: boolean) {
    mergeState({ desktopIconLayoutEnabled: checked });
    await safeSyncSet({ desktopIconLayoutEnabled: checked });
    await applyToCurrentTabIfNeeded();
  }

  async function setDesktopIconLayoutMode(value: PopupState["desktopIconLayoutMode"]) {
    const nextValue = normalizeDesktopIconLayoutMode(value);
    mergeState({ desktopIconLayoutMode: nextValue });
    await safeSyncSet({ desktopIconLayoutMode: nextValue });
    await applyToCurrentTabIfNeeded();
  }

  function setDesktopIconPerColumnDraft(value: string) {
    mergeState({ desktopIconPerColumn: normalizeDesktopIconPerColumn(value) });
  }

  async function commitDesktopIconPerColumn() {
    const desktopIconPerColumn = normalizeDesktopIconPerColumn(stateRef.current.desktopIconPerColumn);
    mergeState({ desktopIconPerColumn });
    await safeSyncSet({ desktopIconPerColumn });
    await applyToCurrentTabIfNeeded();
  }

  async function setLaunchpadIconScaleEnabled(checked: boolean) {
    mergeState({ launchpadIconScaleEnabled: checked });
    await safeSyncSet({ launchpadIconScaleEnabled: checked });
    await applyToCurrentTabIfNeeded();
    await refreshLaunchpadAppList();
  }

  async function setLaunchpadSelection(next: {
    launchpadIconScaleSelectedKeys: string[];
    launchpadIconMaskOnlyKeys: string[];
    launchpadIconRedrawKeys: string[];
  }) {
    const nextState = {
      ...next,
      launchpadAppListStatus: buildLaunchpadStatus(stateRef.current.launchpadItems, {
        ...stateRef.current,
        ...next
      })
    };
    mergeState(nextState);
    await persistLaunchpadSelections(next);
    await applyToCurrentTabIfNeeded();
  }

  async function toggleLaunchpadScale(key: string, checked: boolean) {
    const current = stateRef.current;
    const nextScale = new Set(current.launchpadIconScaleSelectedKeys);
    const nextMask = new Set(current.launchpadIconMaskOnlyKeys);
    const nextRedraw = new Set(current.launchpadIconRedrawKeys);
    if (checked) {
      nextScale.add(key);
      nextRedraw.delete(key);
    } else {
      nextScale.delete(key);
    }
    await setLaunchpadSelection({
      launchpadIconScaleSelectedKeys: Array.from(nextScale),
      launchpadIconMaskOnlyKeys: Array.from(nextMask),
      launchpadIconRedrawKeys: Array.from(nextRedraw)
    });
  }

  async function toggleLaunchpadMaskOnly(key: string, checked: boolean) {
    const current = stateRef.current;
    const nextScale = new Set(current.launchpadIconScaleSelectedKeys);
    const nextMask = new Set(current.launchpadIconMaskOnlyKeys);
    const nextRedraw = new Set(current.launchpadIconRedrawKeys);
    if (checked) {
      nextMask.add(key);
      nextRedraw.delete(key);
    } else {
      nextMask.delete(key);
    }
    await setLaunchpadSelection({
      launchpadIconScaleSelectedKeys: Array.from(nextScale),
      launchpadIconMaskOnlyKeys: Array.from(nextMask),
      launchpadIconRedrawKeys: Array.from(nextRedraw)
    });
  }

  async function toggleLaunchpadRedraw(key: string, checked: boolean) {
    const current = stateRef.current;
    const nextScale = new Set(current.launchpadIconScaleSelectedKeys);
    const nextMask = new Set(current.launchpadIconMaskOnlyKeys);
    const nextRedraw = new Set(current.launchpadIconRedrawKeys);
    if (checked) {
      nextRedraw.add(key);
      nextScale.delete(key);
      nextMask.delete(key);
    } else {
      nextRedraw.delete(key);
    }
    await setLaunchpadSelection({
      launchpadIconScaleSelectedKeys: Array.from(nextScale),
      launchpadIconMaskOnlyKeys: Array.from(nextMask),
      launchpadIconRedrawKeys: Array.from(nextRedraw)
    });
  }

  function setFontSettingsDraft(patch: Partial<FontSettings>) {
    mergeState({
      fontSettings: {
        ...stateRef.current.fontSettings,
        ...patch
      }
    });
  }

  async function commitFontSettings() {
    const fontSettings = normalizeFontSettings(stateRef.current.fontSettings);
    mergeState({ fontSettings });
    await safeSyncSet({
      fontOverrideEnabled: fontSettings.enabled,
      fontFamily: fontSettings.family,
      fontMonospaceFamily: fontSettings.monospaceFamily,
      fontWeight: fontSettings.weight,
      fontFeatureSettings: fontSettings.featureSettings,
      fontFaceName: fontSettings.faceName,
      fontUrl: fontSettings.url
    });
    await applyToCurrentTabIfNeeded();
  }

  function setCustomCodeSettingsDraft(patch: Partial<CustomCodeSettings>) {
    mergeState({
      customCodeSettings: {
        ...stateRef.current.customCodeSettings,
        ...patch
      },
      customCodeStatus: CUSTOM_CODE_STATUS_DEFAULT
    });
  }

  async function commitCustomCodeSettings() {
    const customCodeSettings = normalizeCustomCodeSettings(stateRef.current.customCodeSettings);
    mergeState({ customCodeSettings });
    const syncOk = await safeSyncSet({
      customCodeEnabled: customCodeSettings.enabled
    });
    const localSetResult = await safeLocalSet({
      [CUSTOM_CSS_LOCAL_KEY]: customCodeSettings.css,
      [CUSTOM_JS_LOCAL_KEY]: customCodeSettings.js
    });

    if (!localSetResult.ok) {
      mergeState({
        customCodeStatus: localSetResult.isQuota
          ? "自定义代码保存失败：存储空间不足，请精简代码后重试"
          : "自定义代码保存失败：本地存储写入失败"
      });
      return;
    }

    mergeState({
      customCodeStatus: syncOk ? CUSTOM_CODE_STATUS_DEFAULT : "自定义代码已本地保存，同步存储写入失败"
    });
    await applyToCurrentTabIfNeeded({ refreshCustomCode: true });
  }

  function setLockscreenDefaultUsernameDraft(value: string) {
    mergeState({
      lockscreenDefaultUsername: normalizeLockscreenDefaultUsername(value)
    });
  }

  async function commitLockscreenDefaultUsername() {
    const lockscreenDefaultUsername = normalizeLockscreenDefaultUsername(
      stateRef.current.lockscreenDefaultUsername
    );
    mergeState({ lockscreenDefaultUsername });
    await safeSyncSet({ lockscreenDefaultUsername });
    await applyToCurrentTabIfNeeded();
  }

  async function uploadLoginWallpaper(file: File | null) {
    if (!file) return;
    if (file.type && !file.type.startsWith("image/")) {
      mergeState({
        loginWallpaperStatus: "壁纸导入失败：请选择图片文件"
      });
      return;
    }

    try {
      const dataUrl = await readFileAsDataUrl(file);
      const localSetResult = await safeLocalSet({
        [LOGIN_WALLPAPER_LOCAL_DATA_KEY]: dataUrl,
        [LOGIN_WALLPAPER_LOCAL_NAME_KEY]: file.name
      });
      if (!localSetResult.ok) {
        mergeState({
          loginWallpaperStatus: localSetResult.isQuota
            ? "壁纸导入失败：存储空间不足，请选择更小的图片后重试"
            : "壁纸导入失败：本地存储写入失败"
        });
        return;
      }

      loginWallpaperDataUrlRef.current = dataUrl;
      loginWallpaperFileNameRef.current = file.name;
      mergeState({
        loginWallpaperStatus: buildLoginWallpaperStatus(dataUrl, file.name)
      });
      await applyToCurrentTabIfNeeded({ refreshLoginWallpaper: true });
    } catch {
      mergeState({
        loginWallpaperStatus: "壁纸导入失败：文件读取失败"
      });
    }
  }

  async function clearLoginWallpaper() {
    const ok = await safeLocalRemove([
      LOGIN_WALLPAPER_LOCAL_DATA_KEY,
      LOGIN_WALLPAPER_LOCAL_NAME_KEY
    ]);
    if (!ok) return;
    loginWallpaperDataUrlRef.current = "";
    loginWallpaperFileNameRef.current = "";
    mergeState({
      loginWallpaperStatus: buildLoginWallpaperStatus("", "")
    });
    await applyToCurrentTabIfNeeded({ refreshLoginWallpaper: true });
  }

  return {
    state,
    actions: {
      checkForUpdates,
      setSiteEnabled,
      setAutoEnableSuspectedFnOS,
      setBasePresetEnabled,
      previewBrandColor,
      commitBrandColor,
      resetBrandColor,
      setWindowAnimationBlurEnabled,
      setTitlebarStyle,
      setLaunchpadStyle,
      setDesktopIconLayoutEnabled,
      setDesktopIconLayoutMode,
      setDesktopIconPerColumnDraft,
      commitDesktopIconPerColumn,
      setLaunchpadIconScaleEnabled,
      toggleLaunchpadScale,
      toggleLaunchpadMaskOnly,
      toggleLaunchpadRedraw,
      setFontSettingsDraft,
      commitFontSettings,
      setCustomCodeSettingsDraft,
      commitCustomCodeSettings,
      setLockscreenDefaultUsernameDraft,
      commitLockscreenDefaultUsername,
      uploadLoginWallpaper,
      clearLoginWallpaper
    }
  };
}
