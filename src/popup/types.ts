export type TitlebarStyle = "windows" | "mac";
export type LaunchpadStyle = "classic" | "spotlight";
export type DesktopIconLayoutMode = "adaptive" | "fixed";

export interface FontSettings {
  enabled: boolean;
  family: string;
  monospaceFamily: string;
  weight: string;
  featureSettings: string;
  faceName: string;
  url: string;
}

export interface CustomCodeSettings {
  enabled: boolean;
  css: string;
  js: string;
}

export interface UpdateState {
  baseVersion: string;
  baseSha: string;
  lastCheckedAt: number;
  latestSha: string;
  latestDate: string;
  latestUrl: string;
  latestMessage: string;
  hasUpdate: boolean;
  lastResult: "" | "first" | "same" | "new" | "error";
  lastError: string;
}

export interface LaunchpadItem {
  key: string;
  title: string;
  iconSrc: string;
  redrawAvailable: boolean;
  redrawPath: string;
  redrawHint: string;
}

export interface PopupState {
  manifestVersion: string;
  originText: string;
  isHttpPage: boolean;
  isInitializing: boolean;
  isFnOSWebUi: boolean;
  siteEnabled: boolean;
  autoEnableSuspectedFnOS: boolean;
  basePresetEnabled: boolean;
  windowAnimationBlurEnabled: boolean;
  titlebarStyle: TitlebarStyle;
  launchpadStyle: LaunchpadStyle;
  desktopIconLayoutEnabled: boolean;
  desktopIconLayoutMode: DesktopIconLayoutMode;
  desktopIconPerColumn: number;
  launchpadIconScaleEnabled: boolean;
  launchpadIconScaleSelectedKeys: string[];
  launchpadIconMaskOnlyKeys: string[];
  launchpadIconRedrawKeys: string[];
  launchpadItems: LaunchpadItem[];
  launchpadAppListStatus: string;
  brandColor: string;
  fontSettings: FontSettings;
  customCodeSettings: CustomCodeSettings;
  customCodeStatus: string;
  loginWallpaperStatus: string;
  lockscreenDefaultUsername: string;
  updateState: UpdateState;
  isUpdateChecking: boolean;
}
