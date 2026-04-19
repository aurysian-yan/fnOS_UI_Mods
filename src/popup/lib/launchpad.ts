import {
  DEFAULT_PREFECT_ICON_MAP,
  PREFECT_ICON_DIR,
  PREFECT_ICON_MAP_FILE
} from "./constants";
import type { LaunchpadItem } from "../types";

interface LaunchpadSourceItem {
  key: string;
  title: string;
  iconSrc: string;
}

interface PrefectIconMapConfig {
  aliases: Record<string, string>;
  appNameMap: Record<string, string>;
  serviceIconMap: Record<string, string>;
  keyMap: Record<string, string>;
}

interface LaunchpadRedrawAvailability {
  path: string;
  candidates: string[];
  mappedPath: string;
}

export function normalizeLaunchpadKeyList(value: unknown, maxLength = 320) {
  if (!Array.isArray(value)) return [];
  const unique = new Set<string>();
  value.forEach((item) => {
    if (typeof item !== "string") return;
    const key = item.trim().slice(0, maxLength);
    if (!key) return;
    unique.add(key);
  });
  return Array.from(unique);
}

export function isSameStringArray(left: string[], right: string[]) {
  if (left.length !== right.length) return false;
  return left.every((item, index) => item === right[index]);
}

export function normalizeLaunchpadRedrawMap(value: unknown, maxLength = 320) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const normalized: Record<string, string> = {};
  Object.entries(value).forEach(([rawKey, rawPath]) => {
    if (typeof rawKey !== "string" || typeof rawPath !== "string") return;
    const key = rawKey.trim().slice(0, maxLength);
    const path = rawPath.trim();
    if (!key || !/^prefect_icon\/[a-z0-9-]+\.png$/i.test(path)) return;
    normalized[key] = path;
  });
  return normalized;
}

function normalizeLaunchpadRedrawName(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|svg|webp)$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeLaunchpadAppName(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizePrefectIconRelativePath(value: unknown) {
  if (typeof value !== "string") return "";
  const trimmed = value.trim().replace(/\\/g, "/");
  if (!trimmed) return "";
  if (/^prefect_icon\/[a-z0-9-]+\.png$/i.test(trimmed)) {
    return trimmed;
  }
  const normalizedName = normalizeLaunchpadRedrawName(trimmed);
  return normalizedName ? `${PREFECT_ICON_DIR}/${normalizedName}.png` : "";
}

function getLaunchpadKeyPathname(rawKey: string) {
  if (!rawKey.trim()) return "";
  try {
    const url = new URL(rawKey.trim(), "https://fnos.local");
    return url.pathname.toLowerCase();
  } catch {
    return rawKey.trim().split("?")[0].toLowerCase();
  }
}

function extractLaunchpadServiceIconId(key: string) {
  const pathname = getLaunchpadKeyPathname(key);
  const matched = pathname.match(/\/app-center-static\/serviceicon\/([^/]+)\//i);
  if (!matched?.[1]) return "";
  try {
    return decodeURIComponent(matched[1]);
  } catch {
    return matched[1];
  }
}

function extractLaunchpadStaticIconName(key: string) {
  const pathname = getLaunchpadKeyPathname(key);
  const matched = pathname.match(/\/static\/app\/icons\/([^/]+)\.(png|jpg|jpeg|svg|webp)$/i);
  if (!matched?.[1]) return "";
  try {
    return decodeURIComponent(matched[1]);
  } catch {
    return matched[1];
  }
}

function normalizePrefectIconMapConfig(value: unknown): PrefectIconMapConfig {
  const normalized: PrefectIconMapConfig = {
    aliases: {},
    appNameMap: {},
    serviceIconMap: {},
    keyMap: {}
  };

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return normalized;
  }

  const rawValue = value as Record<string, unknown>;

  Object.entries((rawValue.aliases as Record<string, string>) || {}).forEach(([rawFrom, rawTo]) => {
    const from = normalizeLaunchpadRedrawName(rawFrom);
    const to = normalizeLaunchpadRedrawName(rawTo);
    if (from && to) normalized.aliases[from] = to;
  });

  Object.entries((rawValue.serviceIconMap as Record<string, string>) || {}).forEach(([rawId, rawPath]) => {
    const id = normalizeLaunchpadRedrawName(rawId);
    const path = normalizePrefectIconRelativePath(rawPath);
    if (id && path) normalized.serviceIconMap[id] = path;
  });

  Object.entries((rawValue.appNameMap as Record<string, string>) || {}).forEach(([rawName, rawPath]) => {
    const name = normalizeLaunchpadAppName(rawName);
    const path = normalizePrefectIconRelativePath(rawPath);
    if (name && path) normalized.appNameMap[name] = path;
  });

  Object.entries((rawValue.keyMap as Record<string, string>) || {}).forEach(([rawKey, rawPath]) => {
    const keyPath = getLaunchpadKeyPathname(rawKey);
    const path = normalizePrefectIconRelativePath(rawPath);
    if (keyPath && path) normalized.keyMap[keyPath] = path;
  });

  return normalized;
}

function buildPrefectIconMap(parsed: PrefectIconMapConfig): PrefectIconMapConfig {
  return {
    aliases: {
      ...DEFAULT_PREFECT_ICON_MAP.aliases,
      ...parsed.aliases
    },
    appNameMap: parsed.appNameMap,
    serviceIconMap: parsed.serviceIconMap,
    keyMap: parsed.keyMap
  };
}

export async function loadPrefectIconMap(): Promise<PrefectIconMapConfig> {
  try {
    const response = await fetch(chrome.runtime.getURL(PREFECT_ICON_MAP_FILE), {
      cache: "no-store"
    });
    if (!response.ok) {
      throw new Error(`load_failed_${response.status}`);
    }
    return buildPrefectIconMap(normalizePrefectIconMapConfig(await response.json()));
  } catch {
    return buildPrefectIconMap(normalizePrefectIconMapConfig({}));
  }
}

export function normalizeLaunchpadAppItems(items: unknown): LaunchpadSourceItem[] {
  if (!Array.isArray(items)) return [];
  const keyMap = new Map<string, LaunchpadSourceItem>();
  items.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const entry = item as Record<string, unknown>;
    const rawKey =
      typeof entry.key === "string"
        ? entry.key
        : typeof entry.src === "string"
          ? entry.src
          : "";
    const key = rawKey.trim();
    if (!key || keyMap.has(key)) return;
    const title =
      typeof entry.title === "string" && entry.title.trim()
        ? entry.title.trim()
        : key.split("/").pop() || key;
    const iconSrc =
      typeof entry.iconSrc === "string" && entry.iconSrc.trim()
        ? entry.iconSrc.trim()
        : typeof entry.src === "string" && entry.src.trim()
          ? entry.src.trim()
          : "";
    keyMap.set(key, { key, title, iconSrc });
  });
  return Array.from(keyMap.values());
}

function resolveMappedPrefectIconPathForItem(
  key: string,
  title: string,
  prefectIconMap: PrefectIconMapConfig
) {
  const appName = normalizeLaunchpadAppName(title);
  if (appName) {
    const appNameMappedPath = normalizePrefectIconRelativePath(prefectIconMap.appNameMap[appName]);
    if (appNameMappedPath) return appNameMappedPath;
  }

  const keyPath = getLaunchpadKeyPathname(key);
  if (!keyPath) return "";

  const keyMappedPath = normalizePrefectIconRelativePath(prefectIconMap.keyMap[keyPath]);
  if (keyMappedPath) return keyMappedPath;

  const serviceIconId = normalizeLaunchpadRedrawName(extractLaunchpadServiceIconId(key));
  return serviceIconId
    ? normalizePrefectIconRelativePath(prefectIconMap.serviceIconMap[serviceIconId])
    : "";
}

function buildLaunchpadRedrawNameCandidates(
  key: string,
  title: string,
  prefectIconMap: PrefectIconMapConfig
) {
  const unique = new Set<string>();
  const addCandidate = (rawValue: unknown) => {
    const normalized = normalizeLaunchpadRedrawName(rawValue);
    if (!normalized) return;
    unique.add(normalized);
    const alias = prefectIconMap.aliases[normalized];
    if (typeof alias === "string") {
      const aliasName = normalizeLaunchpadRedrawName(alias);
      if (aliasName) unique.add(aliasName);
    }
  };

  const serviceIconId = extractLaunchpadServiceIconId(key);
  addCandidate(serviceIconId);
  if (serviceIconId.startsWith("docker-")) {
    addCandidate(serviceIconId.slice("docker-".length));
  }
  const serviceIconTokens = serviceIconId.split("-").filter(Boolean);
  if (serviceIconTokens.length > 1) {
    addCandidate(serviceIconTokens.slice(1).join("-"));
  }
  addCandidate(extractLaunchpadStaticIconName(key));
  addCandidate(title);
  addCandidate(getLaunchpadKeyPathname(key).split("/").pop() || "");
  return Array.from(unique);
}

async function checkPrefectIconResourceExists(relativePath: string, cache: Map<string, Promise<boolean>>) {
  if (cache.has(relativePath)) {
    return cache.get(relativePath)!;
  }
  const checkPromise = (async () => {
    const resourceUrl = chrome.runtime.getURL(relativePath);
    try {
      const headResponse = await fetch(resourceUrl, { method: "HEAD", cache: "no-store" });
      if (headResponse.ok) return true;
    } catch {
      // ignore
    }
    try {
      const getResponse = await fetch(resourceUrl, { cache: "no-store" });
      return getResponse.ok;
    } catch {
      return false;
    }
  })();
  cache.set(relativePath, checkPromise);
  return checkPromise;
}

export async function resolveLaunchpadItems(
  sourceItems: LaunchpadSourceItem[],
  prefectIconMap: PrefectIconMapConfig,
  resourceExistsCache: Map<string, Promise<boolean>>
) {
  const availabilityByKey = new Map<string, LaunchpadRedrawAvailability>();
  await Promise.all(
    sourceItems.map(async ({ key, title }) => {
      const mappedPath = resolveMappedPrefectIconPathForItem(key, title, prefectIconMap);
      const candidates = buildLaunchpadRedrawNameCandidates(key, title, prefectIconMap);
      let path = "";
      if (mappedPath) {
        const mappedExists = await checkPrefectIconResourceExists(mappedPath, resourceExistsCache);
        if (mappedExists) path = mappedPath;
      }
      for (const candidate of candidates) {
        if (path) break;
        const relativePath = `${PREFECT_ICON_DIR}/${candidate}.png`;
        const exists = await checkPrefectIconResourceExists(relativePath, resourceExistsCache);
        if (exists) path = relativePath;
      }
      availabilityByKey.set(key, { path, candidates, mappedPath });
    })
  );

  const items: LaunchpadItem[] = sourceItems.map((item) => {
    const redrawInfo = availabilityByKey.get(item.key);
    const redrawPath = redrawInfo?.path || "";
    const redrawAvailable = Boolean(redrawPath);
    const redrawHint = redrawAvailable
      ? `使用 ${redrawPath} 替换原始图标`
      : `未找到重绘图标：${[
          redrawInfo?.mappedPath || "",
          ...(redrawInfo?.candidates || []).slice(0, 3).map((name) => `${PREFECT_ICON_DIR}/${name}.png`)
        ]
          .filter(Boolean)
          .join(" / ") || `${PREFECT_ICON_DIR}/<name>.png`}`;
    return {
      ...item,
      redrawAvailable,
      redrawPath,
      redrawHint
    };
  });

  return { items, availabilityByKey };
}

export function buildLaunchpadRedrawMapFromSelection(
  selectedKeys: string[],
  availabilityByKey: Map<string, LaunchpadRedrawAvailability>,
  currentMap: Record<string, string>
) {
  const map: Record<string, string> = {};
  normalizeLaunchpadKeyList(selectedKeys).forEach((key) => {
    const availabilityPath = availabilityByKey.get(key)?.path;
    const fallbackPath = currentMap[key];
    const path = availabilityPath || fallbackPath || "";
    if (/^prefect_icon\/[a-z0-9-]+\.png$/i.test(path)) {
      map[key] = path;
    }
  });
  return map;
}
