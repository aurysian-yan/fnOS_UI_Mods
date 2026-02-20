(() => {
  const UPDATE_STATE_LOCAL_KEY = "updateCheckState";
  const GITHUB_COMMITS_PAGE_URL =
    "https://github.com/aurysian-yan/FnOS_UI_Mods/commits";
  const GITHUB_COMMITS_API_URL =
    "https://api.github.com/repos/aurysian-yan/FnOS_UI_Mods/commits?per_page=1";
  const ACTION_BADGE_TEXT = "UP";
  const manifestVersion = chrome.runtime.getManifest().version;

  let updateCheckInFlight = null;

  function normalizeText(value, maxLength = 300) {
    if (typeof value !== "string") return "";
    return value.trim().slice(0, maxLength);
  }

  function normalizeUpdateState(raw) {
    const next = raw && typeof raw === "object" ? raw : {};
    const parsedLastCheckedAt = Number(next.lastCheckedAt);
    const allowedResult = new Set(["first", "same", "new", "error"]);
    const lastResult = allowedResult.has(next.lastResult) ? next.lastResult : "";
    return {
      baseVersion: normalizeText(next.baseVersion, 40) || manifestVersion,
      baseSha: normalizeText(next.baseSha, 128),
      lastCheckedAt:
        Number.isFinite(parsedLastCheckedAt) && parsedLastCheckedAt > 0
          ? parsedLastCheckedAt
          : 0,
      latestSha: normalizeText(next.latestSha, 128),
      latestDate: normalizeText(next.latestDate, 80),
      latestUrl:
        normalizeText(next.latestUrl, 1000) || GITHUB_COMMITS_PAGE_URL,
      latestMessage: normalizeText(next.latestMessage, 200),
      hasUpdate: Boolean(next.hasUpdate || next.lastResult === "new"),
      lastResult,
      lastError: normalizeText(next.lastError, 200)
    };
  }

  function parseUpdateErrorMessage(error) {
    const rawMessage = String(error?.message || "").toLowerCase();
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

  async function fetchLatestCommit() {
    const response = await fetch(GITHUB_COMMITS_API_URL, {
      headers: {
        Accept: "application/vnd.github+json"
      }
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
    const message = normalizeText(firstLine, 200);
    const date =
      normalizeText(latest?.commit?.committer?.date, 80) ||
      normalizeText(latest?.commit?.author?.date, 80);
    const url = normalizeText(latest?.html_url, 1000) || GITHUB_COMMITS_PAGE_URL;

    return {
      sha: latest.sha,
      date,
      url,
      message
    };
  }

  async function loadUpdateState() {
    const localState = await chrome.storage.local.get({
      [UPDATE_STATE_LOCAL_KEY]: null
    });
    return normalizeUpdateState(localState[UPDATE_STATE_LOCAL_KEY]);
  }

  async function saveUpdateState(state) {
    await chrome.storage.local.set({
      [UPDATE_STATE_LOCAL_KEY]: state
    });
  }

  async function syncActionBadge(state) {
    if (!chrome?.action?.setBadgeText) return;
    const hasUpdate = Boolean(state?.hasUpdate);
    try {
      await chrome.action.setBadgeText({
        text: hasUpdate ? ACTION_BADGE_TEXT : ""
      });
      if (hasUpdate && chrome.action.setBadgeBackgroundColor) {
        await chrome.action.setBadgeBackgroundColor({
          color: "#ff6633"
        });
      }
    } catch (_error) {
      // ignore badge update failures
    }
  }

  async function checkForUpdates({ force = false } = {}) {
    if (updateCheckInFlight) {
      return updateCheckInFlight;
    }

    updateCheckInFlight = (async () => {
      const current = await loadUpdateState();
      let nextState = { ...current };

      if (nextState.baseVersion !== manifestVersion) {
        nextState.baseVersion = manifestVersion;
        nextState.baseSha = "";
        nextState.hasUpdate = false;
      }

      try {
        const latest = await fetchLatestCommit();
        const baseSha = normalizeText(nextState.baseSha, 128);
        const hasBase = Boolean(baseSha);
        const hasUpdate = hasBase && latest.sha !== baseSha;
        const nextBaseSha = hasBase ? baseSha : latest.sha;

        nextState = {
          ...nextState,
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
        if (force) {
          nextState = {
            ...nextState,
            lastCheckedAt: Date.now(),
            lastResult: "error",
            lastError: parseUpdateErrorMessage(error)
          };
        }
      }

      await saveUpdateState(nextState);
      await syncActionBadge(nextState);
      return nextState;
    })()
      .finally(() => {
        updateCheckInFlight = null;
      });

    return updateCheckInFlight;
  }

  chrome.runtime.onStartup.addListener(() => {
    void checkForUpdates({ force: true });
  });

  chrome.runtime.onInstalled.addListener(() => {
    void checkForUpdates({ force: true });
  });

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message?.type === "FNOS_INJECTION_TRIGGERED") {
      void checkForUpdates({ force: true }).then(() => {
        sendResponse({ ok: true });
      });
      return true;
    }

    if (message?.type === "FNOS_CHECK_UPDATE_NOW") {
      void checkForUpdates({ force: true }).then((state) => {
        sendResponse({ ok: true, state });
      });
      return true;
    }

    if (message?.type === "FNOS_SYNC_UPDATE_BADGE") {
      void loadUpdateState()
        .then((state) => syncActionBadge(state))
        .then(() => sendResponse({ ok: true }));
      return true;
    }
  });

  void loadUpdateState().then((state) => syncActionBadge(state));
})();
