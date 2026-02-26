import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { AboutPage } from './AboutPage';
import { LegacyPopupPage } from './LegacyPopupPage';

const DEFAULT_PATH = '/';
const HTML_ROUTE_DIR_ATTR = 'data-popup-route-direction';

const ROUTES = [
  { path: '/', order: 0 },
  { path: '/about', order: 1 }
];

function normalizePath(rawPath) {
  if (typeof rawPath !== 'string') return DEFAULT_PATH;
  const trimmed = rawPath.trim();
  if (!trimmed || trimmed === '#') return DEFAULT_PATH;

  const withoutHash = trimmed.startsWith('#') ? trimmed.slice(1) : trimmed;
  const withoutQuery = withoutHash.split('?')[0].split('#')[0];
  const withLeadingSlash = withoutQuery.startsWith('/')
    ? withoutQuery
    : `/${withoutQuery}`;

  const normalized = withLeadingSlash
    .replace(/\/{2,}/g, '/')
    .replace(/\/$/, '');
  return normalized || DEFAULT_PATH;
}

function getPathFromHash() {
  return normalizePath(window.location.hash);
}

export function App() {
  const routeMap = useMemo(() => new Map(ROUTES.map((route) => [route.path, route])), []);
  const resolvePath = useCallback(
    (rawPath) => {
      const normalized = normalizePath(rawPath);
      return routeMap.has(normalized) ? normalized : DEFAULT_PATH;
    },
    [routeMap]
  );

  const [activePath, setActivePath] = useState(() => resolvePath(getPathFromHash()));
  const activePathRef = useRef(activePath);

  useEffect(() => {
    activePathRef.current = activePath;
  }, [activePath]);

  const setHashIfNeeded = useCallback((resolvedPath) => {
    const expectedHash = `#${resolvedPath}`;
    if (window.location.hash === expectedHash) return;
    window.location.hash = resolvedPath;
  }, []);

  const applyRouteChange = useCallback(
    (rawPath, options = {}) => {
      const { syncHash = false, animate = true } = options;
      const nextPath = resolvePath(rawPath);
      const previousPath = activePathRef.current;

      if (nextPath === previousPath) {
        if (syncHash) setHashIfNeeded(nextPath);
        return;
      }

      const previousOrder = routeMap.get(previousPath)?.order ?? 0;
      const nextOrder = routeMap.get(nextPath)?.order ?? previousOrder;
      const direction = nextOrder >= previousOrder ? 'forward' : 'backward';
      document.documentElement.setAttribute(HTML_ROUTE_DIR_ATTR, direction);

      const commit = () => {
        flushSync(() => {
          setActivePath(nextPath);
        });
        activePathRef.current = nextPath;
        if (syncHash) setHashIfNeeded(nextPath);
      };

      if (animate && typeof document.startViewTransition === 'function') {
        document.startViewTransition(commit);
        return;
      }

      commit();
    },
    [resolvePath, routeMap, setHashIfNeeded]
  );

  useEffect(() => {
    const handleHashChange = () => {
      applyRouteChange(getPathFromHash(), { syncHash: false, animate: true });
    };

    if (!window.location.hash) {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}#${DEFAULT_PATH}`
      );
      applyRouteChange(DEFAULT_PATH, { syncHash: false, animate: false });
    } else {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [applyRouteChange]);

  const navigate = useCallback(
    (nextPath) => {
      applyRouteChange(nextPath, { syncHash: true, animate: true });
    },
    [applyRouteChange]
  );

  return (
    <div className="popup-router-root">
      <section
        className={`popup-route-pane ${activePath === '/' ? 'is-active' : 'is-inactive'}`}
        aria-hidden={activePath !== '/'}
      >
        <div className="popup-route-pane-content">
          <LegacyPopupPage />
        </div>
      </section>
      <section
        className={`popup-route-pane ${activePath === '/about' ? 'is-active' : 'is-inactive'}`}
        aria-hidden={activePath !== '/about'}
      >
        <div className="popup-route-pane-content">
          <AboutPage />
        </div>
      </section>
      <button
        type="button"
        className="popup-router-toggle"
        onClick={() => navigate(activePath === '/about' ? '/' : '/about')}
      >
        {activePath === '/about' ? '返回设置' : '关于'}
      </button>
    </div>
  );
}
