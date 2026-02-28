import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import React, { useEffect, useRef, useState } from 'react';
import { Code, SlidersHorizontal } from '@phosphor-icons/react';
import { Switch, Tabs } from './components';
import {
  ChakraBrandColorPicker,
  ChakraNativeRadioGroup,
  ChakraNativeSelect,
  LaunchpadPerfectIconDrawer
} from './components/ChakraSettingsControls';
import { initPopup } from './legacy-popup';

const TEMPLATE_PATH = './popup-template.html';
const SETTINGS_TAB_STORAGE_KEY = 'popupSettingsActiveTab';
const DEFAULT_SETTINGS_TAB_ID = 'general';

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

function ensureChakraNativeHiddenHost(hostElement) {
  let hiddenHost = hostElement.querySelector('.chakra-native-hidden-host');
  if (hiddenHost) return hiddenHost;

  hiddenHost = document.createElement('div');
  hiddenHost.className = 'chakra-native-hidden-host';
  hostElement.appendChild(hiddenHost);
  return hiddenHost;
}

function buildRadioGroupOptions(groupElement) {
  const optionElements = Array.from(groupElement.querySelectorAll('.platform-option'));
  const options = [];

  for (const optionElement of optionElements) {
    const inputElement = optionElement.querySelector('input[type="radio"]');
    if (!(inputElement instanceof HTMLInputElement)) continue;

    options.push({
      id: inputElement.id,
      value: inputElement.value,
      title: optionElement.querySelector('.platform-title')?.textContent?.trim() || inputElement.value,
      description: optionElement.querySelector('.platform-desc')?.textContent?.trim() || '',
      inputElement
    });
  }

  return options;
}

function replaceStaticControlsWithChakra(hostElement) {
  const roots = [];
  const nativeHiddenHost = ensureChakraNativeHiddenHost(hostElement);

  const brandColorInput = hostElement.querySelector('#brandColor');
  if (brandColorInput instanceof HTMLInputElement) {
    const themeControlsElement = brandColorInput.closest('.theme-controls');
    const mountElement = document.createElement('div');
    mountElement.className = 'chakra-color-picker-mount';

    if (themeControlsElement?.parentElement) {
      themeControlsElement.parentElement.replaceChild(mountElement, themeControlsElement);
    } else {
      brandColorInput.parentElement?.appendChild(mountElement);
    }

    brandColorInput.classList.add('chakra-native-hidden');
    nativeHiddenHost.appendChild(brandColorInput);

    const root = createRoot(mountElement);
    flushSync(() => {
      root.render(<ChakraBrandColorPicker nativeInput={brandColorInput} />);
    });
    roots.push(root);
  }

  function mountRadioGroup(groupSelector) {
    const groupElement = hostElement.querySelector(groupSelector);
    if (!(groupElement instanceof HTMLElement)) return;

    const options = buildRadioGroupOptions(groupElement);
    if (options.length === 0) return;

    for (const option of options) {
      option.inputElement.classList.add('chakra-native-hidden');
      nativeHiddenHost.appendChild(option.inputElement);
    }

    groupElement.textContent = '';
    const mountElement = document.createElement('div');
    mountElement.className = 'chakra-radio-group-mount';
    groupElement.appendChild(mountElement);

    const root = createRoot(mountElement);
    flushSync(() => {
      root.render(<ChakraNativeRadioGroup options={options} />);
    });
    roots.push(root);
  }

  mountRadioGroup('#platformGroup');
  mountRadioGroup('#launchpadGroup');

  const desktopIconLayoutModeSelect = hostElement.querySelector('#desktopIconLayoutMode');
  if (desktopIconLayoutModeSelect instanceof HTMLSelectElement) {
    const selectOptions = Array.from(desktopIconLayoutModeSelect.options).map((option) => ({
      value: option.value,
      label: option.textContent?.trim() || option.value
    }));

    const mountElement = document.createElement('div');
    mountElement.className = 'chakra-select-mount';
    desktopIconLayoutModeSelect.parentElement?.replaceChild(mountElement, desktopIconLayoutModeSelect);

    desktopIconLayoutModeSelect.classList.add('chakra-native-hidden');
    nativeHiddenHost.appendChild(desktopIconLayoutModeSelect);

    const root = createRoot(mountElement);
    flushSync(() => {
      root.render(
        <ChakraNativeSelect
          nativeSelect={desktopIconLayoutModeSelect}
          options={selectOptions}
        />
      );
    });
    roots.push(root);
  }

  const launchpadSettingsElement = hostElement.querySelector('.launchpad-extra-settings');
  if (launchpadSettingsElement instanceof HTMLElement && launchpadSettingsElement.parentElement) {
    const mountElement = document.createElement('div');
    mountElement.className = 'launchpad-drawer-mount';
    launchpadSettingsElement.parentElement.replaceChild(mountElement, launchpadSettingsElement);

    const root = createRoot(mountElement);
    flushSync(() => {
      root.render(<LaunchpadPerfectIconDrawer settingsSection={launchpadSettingsElement} />);
    });
    roots.push(root);
  }

  return roots;
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

function resolveInitialSettingsTabId() {
  try {
    const stored = sessionStorage.getItem(SETTINGS_TAB_STORAGE_KEY);
    return stored === 'advanced' ? 'advanced' : DEFAULT_SETTINGS_TAB_ID;
  } catch (_error) {
    return DEFAULT_SETTINGS_TAB_ID;
  }
}

function applySettingsTabToPanels(hostElement, tabId, persist = true) {
  const resolvedTabId = tabId === 'advanced' ? 'advanced' : 'general';
  const generalPanel = hostElement.querySelector('#settingsTabPanelGeneral');
  const advancedPanel = hostElement.querySelector('#settingsTabPanelAdvanced');
  if (!generalPanel || !advancedPanel) return;

  const activateGeneral = resolvedTabId === 'general';
  generalPanel.hidden = !activateGeneral;
  advancedPanel.hidden = activateGeneral;
  generalPanel.classList.toggle('is-active', activateGeneral);
  advancedPanel.classList.toggle('is-active', !activateGeneral);
  generalPanel.setAttribute('aria-hidden', activateGeneral ? 'false' : 'true');
  advancedPanel.setAttribute('aria-hidden', activateGeneral ? 'true' : 'false');

  if (!persist) return;
  try {
    sessionStorage.setItem(SETTINGS_TAB_STORAGE_KEY, resolvedTabId);
  } catch (_error) {
    // ignore storage failures
  }
}

function mountSettingsTabs(hostElement) {
  const mountElement = hostElement.querySelector('#settingsTabsReactMount');
  if (!mountElement) return null;

  const initialTabId = resolveInitialSettingsTabId();
  applySettingsTabToPanels(hostElement, initialTabId, false);

  function SettingsTabsMount() {
    const [activeTabId, setActiveTabId] = useState(initialTabId);

    useEffect(() => {
      applySettingsTabToPanels(hostElement, activeTabId, true);
    }, [activeTabId]);

    return (
      <Tabs
        renderPanels={false}
        activeId={activeTabId}
        onChange={setActiveTabId}
        accentColor="var(--switch-on)"
        items={[
          {
            id: 'general',
            label: '常用',
            icon: SlidersHorizontal
          },
          {
            id: 'advanced',
            label: '高级',
            icon: Code
          }
        ]}
      />
    );
  }

  const root = createRoot(mountElement);
  flushSync(() => {
    root.render(<SettingsTabsMount />);
  });
  return root;
}

export function LegacyPopupPage() {
  const [template, setTemplate] = useState('');
  const [loadError, setLoadError] = useState('');
  const initializedRef = useRef(false);
  const templateHostRef = useRef(null);
  const chakraRootsRef = useRef([]);
  const switchRootsRef = useRef([]);
  const settingsTabsRootRef = useRef(null);

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
        chakraRootsRef.current = replaceStaticControlsWithChakra(hostElement);
        const { roots, requiredIds } = replaceStaticSwitchesWithComponent(hostElement);
        switchRootsRef.current = roots;
        settingsTabsRootRef.current = mountSettingsTabs(hostElement);
        await waitForElementIds(requiredIds);
        await initPopup();
      } catch (error) {
        setLoadError(`popup 初始化失败: ${String(error)}`);
      }
    })();
  }, [template]);

  useEffect(
    () => () => {
      for (const root of chakraRootsRef.current) {
        root.unmount();
      }
      chakraRootsRef.current = [];
      for (const root of switchRootsRef.current) {
        root.unmount();
      }
      switchRootsRef.current = [];
      settingsTabsRootRef.current?.unmount();
      settingsTabsRootRef.current = null;
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
