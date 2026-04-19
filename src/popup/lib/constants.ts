import type { CustomCodeSettings, FontSettings, PopupState, UpdateState } from "../types";

export const DEFAULT_BRAND_COLOR = "#0066ff";
export const BRAND_LIGHTNESS_MIN = 0.3;
export const BRAND_LIGHTNESS_MAX = 0.7;
export const DESKTOP_ICON_PER_COLUMN_DEFAULT = 8;
export const DESKTOP_ICON_PER_COLUMN_MIN = 4;
export const DESKTOP_ICON_PER_COLUMN_MAX = 16;
export const DESKTOP_ICON_LAYOUT_MODE_DEFAULT = "adaptive";
export const DEFAULT_FONT_FACE_NAME = "FnOSCustomFont";
export const LOCKSCREEN_DEFAULT_USERNAME_MAX = 80;
export const CUSTOM_CODE_STATUS_DEFAULT = "失焦后自动保存并应用到当前页面";
export const UPDATE_CHECK_INTERVAL_MS = 30 * 60 * 1000;
export const GITHUB_REPO_URL = "https://github.com/aurysian-yan/FnOS_UI_Mods";
export const GITHUB_COMMITS_PAGE_URL = `${GITHUB_REPO_URL}/commits`;
export const GITHUB_COMMITS_API_URL =
  "https://api.github.com/repos/aurysian-yan/FnOS_UI_Mods/commits?per_page=1";
export const PREFECT_ICON_DIR = "prefect_icon";
export const PREFECT_ICON_MAP_FILE = `${PREFECT_ICON_DIR}/icon-map.json`;
export const ACTION_BADGE_TEXT = "UP";
export const FONT_LOCAL_DATA_KEY = "customFontDataUrl";
export const FONT_LOCAL_NAME_KEY = "customFontFileName";
export const FONT_LOCAL_FORMAT_KEY = "customFontFormat";
export const LOGIN_WALLPAPER_LOCAL_DATA_KEY = "loginWallpaperDataUrl";
export const LOGIN_WALLPAPER_LOCAL_NAME_KEY = "loginWallpaperFileName";
export const UPDATE_STATE_LOCAL_KEY = "updateCheckState";
export const CUSTOM_CSS_LOCAL_KEY = "customCssCode";
export const CUSTOM_JS_LOCAL_KEY = "customJsCode";

export const DEFAULT_FONT_SETTINGS: FontSettings = {
  enabled: false,
  family: "",
  monospaceFamily: "",
  weight: "",
  featureSettings: "",
  faceName: DEFAULT_FONT_FACE_NAME,
  url: ""
};

export const DEFAULT_CUSTOM_CODE_SETTINGS: CustomCodeSettings = {
  enabled: false,
  css: "",
  js: ""
};

export const DEFAULT_PREFECT_ICON_MAP = Object.freeze({
  aliases: {
    "docker-home-assistantan": "home-assistant",
    "home-assistantan": "home-assistant"
  },
  appNameMap: {},
  serviceIconMap: {},
  keyMap: {}
});

export const DEFAULT_UPDATE_STATE: UpdateState = {
  baseVersion: "",
  baseSha: "",
  lastCheckedAt: 0,
  latestSha: "",
  latestDate: "",
  latestUrl: GITHUB_COMMITS_PAGE_URL,
  latestMessage: "",
  hasUpdate: false,
  lastResult: "",
  lastError: ""
};

export const INITIAL_POPUP_STATE: PopupState = {
  manifestVersion: "",
  originText: "读取中...",
  isHttpPage: true,
  isInitializing: true,
  isFnOSWebUi: false,
  siteEnabled: false,
  autoEnableSuspectedFnOS: true,
  basePresetEnabled: true,
  windowAnimationBlurEnabled: true,
  titlebarStyle: "windows",
  launchpadStyle: "classic",
  desktopIconLayoutEnabled: true,
  desktopIconLayoutMode: "adaptive",
  desktopIconPerColumn: DESKTOP_ICON_PER_COLUMN_DEFAULT,
  launchpadIconScaleEnabled: false,
  launchpadIconScaleSelectedKeys: [],
  launchpadIconMaskOnlyKeys: [],
  launchpadIconRedrawKeys: [],
  launchpadItems: [],
  launchpadAppListStatus: "应用列表：等待读取",
  brandColor: DEFAULT_BRAND_COLOR,
  fontSettings: { ...DEFAULT_FONT_SETTINGS },
  customCodeSettings: { ...DEFAULT_CUSTOM_CODE_SETTINGS },
  customCodeStatus: CUSTOM_CODE_STATUS_DEFAULT,
  loginWallpaperStatus: "未导入本地壁纸，使用 CSS 默认壁纸",
  lockscreenDefaultUsername: "",
  updateState: { ...DEFAULT_UPDATE_STATE },
  isUpdateChecking: false
};
