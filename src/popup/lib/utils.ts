import {
  BRAND_LIGHTNESS_MAX,
  BRAND_LIGHTNESS_MIN,
  CUSTOM_CODE_STATUS_DEFAULT,
  DEFAULT_BRAND_COLOR,
  DEFAULT_FONT_FACE_NAME,
  GITHUB_COMMITS_PAGE_URL,
  LOCKSCREEN_DEFAULT_USERNAME_MAX
} from "./constants";
import type {
  CustomCodeSettings,
  DesktopIconLayoutMode,
  FontSettings,
  UpdateState
} from "../types";

export function isStorageQuotaErrorMessage(message: unknown) {
  if (typeof message !== "string") return false;
  return /kQuotaBytes|QUOTA_BYTES|quota exceeded/i.test(message);
}

export function normalizeText(value: unknown, maxLength = 300) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export function truncateText(value: unknown, maxLength = 60) {
  return normalizeText(value, maxLength);
}

export function normalizeHex(value: unknown) {
  if (typeof value !== "string") return null;
  const hex = value.trim().toLowerCase();
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/.test(hex)) return null;
  if (hex.length === 4) {
    return `#${hex
      .slice(1)
      .split("")
      .map((char) => char + char)
      .join("")}`;
  }
  return hex;
}

function clampChannel(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function rgbToHsl(r: number, g: number, b: number) {
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

  return { h: h / 6, s, l };
}

function hue2rgb(p: number, q: number, t: number) {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

function hslToRgb(h: number, s: number, l: number) {
  if (s === 0) {
    const value = clampChannel(l * 255);
    return { r: value, g: value, b: value };
  }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return {
    r: clampChannel(hue2rgb(p, q, h + 1 / 3) * 255),
    g: clampChannel(hue2rgb(p, q, h) * 255),
    b: clampChannel(hue2rgb(p, q, h - 1 / 3) * 255)
  };
}

function rgbToHex({ r, g, b }: { r: number; g: number; b: number }) {
  return (
    "#" +
    [r, g, b]
      .map((value) => value.toString(16).padStart(2, "0"))
      .join("")
  );
}

export function hexToRgb(value: unknown) {
  const normalized = normalizeHex(value);
  if (!normalized) return null;
  const intValue = Number.parseInt(normalized.slice(1), 16);
  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255
  };
}

function getRelativeLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const normalizeChannel = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };

  const red = normalizeChannel(r);
  const green = normalizeChannel(g);
  const blue = normalizeChannel(b);

  return red * 0.2126 + green * 0.7152 + blue * 0.0722;
}

export function getReadableTextColor(value: unknown) {
  const rgb = hexToRgb(value);
  if (!rgb) return "#ffffff";

  const luminance = getRelativeLuminance(rgb);
  const whiteContrast = 1.05 / (luminance + 0.05);
  const darkContrast = (luminance + 0.05) / 0.05;

  return whiteContrast >= darkContrast ? "#ffffff" : "#111111";
}

export function clampBrandLightness(hex: unknown) {
  const normalized = normalizeHex(hex);
  if (!normalized) return DEFAULT_BRAND_COLOR;
  const intValue = Number.parseInt(normalized.slice(1), 16);
  const hsl = rgbToHsl((intValue >> 16) & 255, (intValue >> 8) & 255, intValue & 255);
  return rgbToHex(
    hslToRgb(
      hsl.h,
      hsl.s,
      Math.min(BRAND_LIGHTNESS_MAX, Math.max(BRAND_LIGHTNESS_MIN, hsl.l))
    )
  );
}

export function normalizeDesktopIconPerColumn(value: unknown) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return 8;
  return Math.max(4, Math.min(16, parsed));
}

export function normalizeDesktopIconLayoutMode(
  value: unknown,
  legacyEnabled?: boolean | null
): DesktopIconLayoutMode {
  const normalized = typeof value === "string" ? value.trim().toLowerCase() : "";
  if (normalized === "adaptive" || normalized === "fixed") {
    return normalized;
  }
  if (typeof legacyEnabled === "boolean") {
    return legacyEnabled ? "fixed" : "adaptive";
  }
  return "adaptive";
}

export function normalizeFontFamily(value: unknown) {
  return normalizeText(value, 400);
}

export function normalizeFontWeight(value: unknown) {
  const raw = normalizeText(value, 16);
  if (!raw) return "";
  const lowered = raw.toLowerCase();
  if (/^(normal|bold|bolder|lighter)$/.test(lowered)) {
    return lowered;
  }
  if (/^\d{1,4}$/.test(raw)) {
    return String(Math.max(1, Math.min(1000, Number(raw))));
  }
  return "";
}

export function normalizeFontFeatureSettings(value: unknown) {
  return normalizeText(value, 200);
}

export function normalizeFontFaceName(value: unknown) {
  const cleaned = normalizeText(value, 64).replace(/["'`]/g, "");
  return cleaned || DEFAULT_FONT_FACE_NAME;
}

export function normalizeFontUrl(value: unknown) {
  const raw = normalizeText(value, 800);
  if (!raw) return "";
  try {
    const parsed = new URL(raw);
    return parsed.protocol === "http:" || parsed.protocol === "https:"
      ? parsed.toString()
      : "";
  } catch {
    return "";
  }
}

export function normalizeFontSettings(raw: Partial<FontSettings> | null | undefined): FontSettings {
  return {
    enabled: Boolean(raw?.enabled),
    family: normalizeFontFamily(raw?.family),
    monospaceFamily: normalizeFontFamily(raw?.monospaceFamily),
    weight: normalizeFontWeight(raw?.weight),
    featureSettings: normalizeFontFeatureSettings(raw?.featureSettings),
    faceName: normalizeFontFaceName(raw?.faceName),
    url: normalizeFontUrl(raw?.url)
  };
}

export function normalizeCodeText(value: unknown, maxLength = 120000) {
  if (typeof value !== "string") return "";
  return value.slice(0, maxLength);
}

export function normalizeCustomCodeSettings(
  raw: Partial<CustomCodeSettings> | null | undefined
): CustomCodeSettings {
  return {
    enabled: Boolean(raw?.enabled),
    css: normalizeCodeText(raw?.css),
    js: normalizeCodeText(raw?.js)
  };
}

export function normalizeLockscreenDefaultUsername(value: unknown) {
  return normalizeText(value, LOCKSCREEN_DEFAULT_USERNAME_MAX);
}

export function normalizeUpdateState(raw: unknown, manifestVersion: string): UpdateState {
  const next = raw && typeof raw === "object" ? (raw as Partial<UpdateState>) : {};
  const parsedLastCheckedAt = Number(next.lastCheckedAt);
  const allowedResult = new Set(["first", "same", "new", "error"]);
  const lastResult = allowedResult.has(String(next.lastResult)) ? (next.lastResult as UpdateState["lastResult"]) : "";
  return {
    baseVersion: normalizeText(next.baseVersion, 40) || manifestVersion,
    baseSha: normalizeText(next.baseSha, 128),
    lastCheckedAt:
      Number.isFinite(parsedLastCheckedAt) && parsedLastCheckedAt > 0
        ? parsedLastCheckedAt
        : 0,
    latestSha: normalizeText(next.latestSha, 128),
    latestDate: normalizeText(next.latestDate, 80),
    latestUrl: normalizeText(next.latestUrl, 1000) || GITHUB_COMMITS_PAGE_URL,
    latestMessage: normalizeText(next.latestMessage, 200),
    hasUpdate: Boolean(next.hasUpdate || next.lastResult === "new"),
    lastResult,
    lastError: normalizeText(next.lastError, 200)
  };
}

export function shortSha(sha: unknown) {
  const normalized = normalizeText(sha, 128);
  return normalized ? normalized.slice(0, 7) : "";
}

export function formatCommitDate(dateText: unknown) {
  if (typeof dateText !== "string" || !dateText) return "";
  const parsed = new Date(dateText);
  if (!Number.isFinite(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(parsed);
}

export function formatElapsedText(timestamp: number) {
  if (!timestamp || !Number.isFinite(timestamp)) return "";
  const diff = Date.now() - timestamp;
  if (diff < 0) return "";
  if (diff < 60 * 1000) return "刚刚";
  if (diff < 60 * 60 * 1000) return `${Math.floor(diff / (60 * 1000))} 分钟前`;
  if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / (60 * 60 * 1000))} 小时前`;
  return `${Math.floor(diff / (24 * 60 * 60 * 1000))} 天前`;
}

export function getUpdateStatusText(updateState: UpdateState) {
  const elapsedText = formatElapsedText(updateState.lastCheckedAt);
  if (updateState.hasUpdate || updateState.lastResult === "new") {
    return elapsedText ? `发现可用更新 · ${elapsedText}` : "发现可用更新";
  }
  if (updateState.lastResult === "same") {
    return elapsedText ? `暂无更新 · ${elapsedText}` : "暂无更新";
  }
  if (updateState.lastResult === "first") {
    return elapsedText ? `已记录当前最新提交 · ${elapsedText}` : "已记录当前最新提交";
  }
  if (updateState.lastResult === "error") {
    return updateState.lastError || "检查失败";
  }
  return "等待检查";
}

export function parseUpdateErrorMessage(error: unknown) {
  const rawMessage = String((error as Error | undefined)?.message || "").toLowerCase();
  if (rawMessage.includes("http-403") || rawMessage.includes("http-429")) {
    return "检查失败：GitHub API 频率限制";
  }
  if (rawMessage.includes("http-404")) {
    return "检查失败：仓库不存在或无权限";
  }
  if (rawMessage.includes("aborted")) {
    return "检查失败：请求已取消";
  }
  return "检查失败：网络或接口异常";
}

export function inferImageFormat(fileName: string, mimeType: string) {
  const lower = `${fileName || ""} ${mimeType || ""}`.toLowerCase();
  if (lower.includes("webp")) return "webp";
  if (lower.includes("png")) return "png";
  if (lower.includes("jpg") || lower.includes("jpeg")) return "jpg";
  return "image";
}

export function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read-failed"));
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        reject(new Error("invalid-result"));
        return;
      }
      resolve(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

export function buildLoginWallpaperStatus(dataUrl: string, fileName: string, message = "") {
  if (message) return message;
  if (dataUrl && fileName) {
    return `已导入: ${fileName} / ${inferImageFormat(fileName, "")}`;
  }
  return "未导入本地壁纸，使用 CSS 默认壁纸";
}

export function getCustomCodeStatusText(text = "") {
  return text || CUSTOM_CODE_STATUS_DEFAULT;
}
