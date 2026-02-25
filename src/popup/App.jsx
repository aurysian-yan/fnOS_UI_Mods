import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import React, { useEffect, useRef, useState } from 'react';
import { Switch } from './components/Switch';
import { initPopup } from './legacy-popup';

const TEMPLATE_PATH = './popup-template.html';

function getExtraClassNames(element, baseClassName) {
  return Array.from(element.classList)
    .filter((className) => className !== baseClassName)
    .join(' ');
}

function buildSwitchInputProps(inputElement) {
  const inputProps = {};

  for (const { name, value } of Array.from(inputElement.attributes)) {
    if (name === 'type' || name === 'checked' || name === 'disabled') {
      continue;
    }

    if (name === 'class') {
      inputProps.className = value;
      continue;
    }

    inputProps[name] = value;
  }

  if (inputElement.checked) {
    inputProps.defaultChecked = true;
  }
  if (inputElement.disabled) {
    inputProps.disabled = true;
  }

  return inputProps;
}

function resolveSwitchVariant(sliderElement) {
  const hasMask = sliderElement.querySelector(
    '#mask1, #mask2, .switch-mask-left, .switch-mask-right'
  );
  return hasMask ? 'masked' : 'default';
}

function replaceStaticSwitchesWithComponent(hostElement) {
  const roots = [];
  const requiredIds = [];
  const switchLabels = hostElement.querySelectorAll('label.switch');

  for (const labelElement of switchLabels) {
    const inputElement = labelElement.querySelector('input[type="checkbox"]');
    const sliderElement = labelElement.querySelector('.slider');
    const parentElement = labelElement.parentElement;
    if (!inputElement || !sliderElement || !parentElement) continue;
    if (inputElement.id) {
      requiredIds.push(inputElement.id);
    }

    const mountElement = document.createElement('span');
    mountElement.className = 'switch-react-mount';
    parentElement.replaceChild(mountElement, labelElement);

    const root = createRoot(mountElement);
    flushSync(() => {
      root.render(
        <Switch
          {...buildSwitchInputProps(inputElement)}
          labelClassName={getExtraClassNames(labelElement, 'switch')}
          sliderClassName={getExtraClassNames(sliderElement, 'slider')}
          variant={resolveSwitchVariant(sliderElement)}
        />
      );
    });
    roots.push(root);
  }

  return { roots, requiredIds };
}

async function waitForElementIds(elementIds, timeoutMs = 2000) {
  if (!Array.isArray(elementIds) || elementIds.length === 0) return;
  const required = Array.from(new Set(elementIds));
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    const missing = required.filter((id) => !document.getElementById(id));
    if (missing.length === 0) return;
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }

  const missingAfterTimeout = required.filter((id) => !document.getElementById(id));
  throw new Error(`switch 挂载超时，缺少元素: ${missingAfterTimeout.join(', ')}`);
}

export function App() {
  const [template, setTemplate] = useState('');
  const [loadError, setLoadError] = useState('');
  const initializedRef = useRef(false);
  const templateHostRef = useRef(null);
  const switchRootsRef = useRef([]);

  useEffect(() => {
    let canceled = false;

    async function loadTemplate() {
      try {
        const response = await fetch(TEMPLATE_PATH);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const html = await response.text();
        if (!canceled) {
          setTemplate(html);
        }
      } catch (error) {
        if (canceled) return;
        setLoadError(`popup 模板加载失败: ${String(error)}`);
      }
    }

    loadTemplate();
    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    if (!template || initializedRef.current) return;
    initializedRef.current = true;

    const hostElement = templateHostRef.current;
    if (!hostElement) {
      setLoadError('popup 初始化失败: 缺少模板挂载节点');
      return;
    }

    void (async () => {
      try {
        const { roots, requiredIds } = replaceStaticSwitchesWithComponent(hostElement);
        switchRootsRef.current = roots;
        await waitForElementIds(requiredIds);
        await initPopup();
      } catch (error) {
        setLoadError(`popup 初始化失败: ${String(error)}`);
      }
    })();
  }, [template]);

  useEffect(
    () => () => {
      for (const root of switchRootsRef.current) {
        root.unmount();
      }
      switchRootsRef.current = [];
    },
    []
  );

  if (loadError) {
    return <pre style={{ margin: 12, whiteSpace: 'pre-wrap' }}>{loadError}</pre>;
  }

  if (!template) {
    return <div style={{ margin: 12 }}>加载中...</div>;
  }

  return <div ref={templateHostRef} dangerouslySetInnerHTML={{ __html: template }} />;
}
