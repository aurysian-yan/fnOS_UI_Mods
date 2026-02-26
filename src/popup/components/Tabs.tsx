import React, {
  CSSProperties,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState
} from 'react';
import styles from './Tabs.module.css';

export interface TabItem {
  id: string;
  label: React.ReactNode;
  content?: React.ReactNode;
  icon?: PhosphorIcon;
  iconProps?: Partial<PhosphorIconProps>;
  selectedAddon?: React.ReactNode;
  unselectedAddon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  activeId?: string;
  defaultActiveId?: string;
  onChange?: (id: string) => void;
  widthMode?: 'fill' | 'auto';
  accentColor?: string;
  style?: React.CSSProperties;
  className?: string;
  tabListClassName?: string;
  tabButtonClassName?: string;
  tabButtonActiveClassName?: string;
  tabButtonInactiveClassName?: string;
  tabButtonContentClassName?: string;
  iconClassName?: string;
  addonClassName?: string;
  tabPanelClassName?: string;
  tabPanelActiveClassName?: string;
  renderPanels?: boolean;
  renderSelectedAddon?: (item: TabItem) => React.ReactNode;
  renderUnselectedAddon?: (item: TabItem) => React.ReactNode;
}

function joinClassNames(
  ...classNames: Array<string | undefined | null | false>
): string {
  return classNames.filter(Boolean).join(' ');
}

function resolveFirstEnabledTabId(items: TabItem[]): string {
  const firstEnabled = items.find((item) => !item.disabled);
  return firstEnabled?.id ?? '';
}

export type PhosphorWeight =
  | 'thin'
  | 'light'
  | 'regular'
  | 'bold'
  | 'fill'
  | 'duotone';

export interface PhosphorIconProps {
  size?: number | string;
  weight?: PhosphorWeight;
  color?: string;
  mirrored?: boolean;
  className?: string;
}

export type PhosphorIcon = React.ComponentType<PhosphorIconProps>;

export function Tabs({
  items,
  activeId,
  defaultActiveId,
  onChange,
  widthMode = 'fill',
  accentColor,
  style,
  className,
  tabListClassName,
  tabButtonClassName,
  tabButtonActiveClassName,
  tabButtonInactiveClassName,
  tabButtonContentClassName,
  iconClassName,
  addonClassName,
  tabPanelClassName,
  tabPanelActiveClassName,
  renderPanels = true,
  renderSelectedAddon,
  renderUnselectedAddon
}: TabsProps) {
  const baseId = useId();
  const isControlled = typeof activeId === 'string';
  const enabledItems = useMemo(
    () => items.filter((item) => !item.disabled),
    [items]
  );
  const rootStyle = useMemo(() => {
    if (!accentColor) return style;
    return {
      ...style,
      '--tabs-accent': accentColor
    } as CSSProperties;
  }, [accentColor, style]);

  const [internalActiveId, setInternalActiveId] = useState(() => {
    const preferredId = defaultActiveId && items.some((item) => item.id === defaultActiveId)
      ? defaultActiveId
      : resolveFirstEnabledTabId(items);
    return preferredId;
  });

  const currentActiveId = isControlled
    ? activeId || resolveFirstEnabledTabId(items)
    : internalActiveId;

  const buttonRefMap = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (isControlled) return;
    if (items.some((item) => item.id === internalActiveId && !item.disabled)) return;
    setInternalActiveId(resolveFirstEnabledTabId(items));
  }, [internalActiveId, isControlled, items]);

  const commitActiveId = (nextId: string, focus = false) => {
    if (!nextId) return;
    if (!items.some((item) => item.id === nextId && !item.disabled)) return;
    if (nextId === currentActiveId) {
      if (focus) {
        const targetButton = buttonRefMap.current.get(nextId);
        targetButton?.focus();
      }
      return;
    }
    if (!isControlled) {
      setInternalActiveId(nextId);
    }
    onChange?.(nextId);
    if (focus) {
      const targetButton = buttonRefMap.current.get(nextId);
      targetButton?.focus();
    }
  };

  const handleButtonKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
    tabId: string
  ) => {
    if (!enabledItems.length) return;

    const currentIndex = enabledItems.findIndex((item) => item.id === tabId);
    if (currentIndex < 0) return;

    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % enabledItems.length;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + enabledItems.length) % enabledItems.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = enabledItems.length - 1;
    } else {
      return;
    }

    event.preventDefault();
    commitActiveId(enabledItems[nextIndex].id, true);
  };

  return (
    <div
      className={joinClassNames(styles.tabsRoot, className)}
      style={rootStyle}
    >
      <div
        className={joinClassNames(
          styles.tabList,
          widthMode === 'auto' ? styles.tabListAuto : styles.tabListFill,
          tabListClassName
        )}
        role="tablist"
        aria-orientation="horizontal"
      >
        {items.map((item) => {
          const selected = item.id === currentActiveId;
          const Icon = item.icon;
          const tabButtonId = `${baseId}-tab-${item.id}`;
          const tabPanelId = `${baseId}-panel-${item.id}`;
          const addon = selected
            ? item.selectedAddon ?? renderSelectedAddon?.(item)
            : item.unselectedAddon ?? renderUnselectedAddon?.(item);
          const itemIconProps = item.iconProps ?? {};
          const iconWeight = itemIconProps.weight ?? (selected ? 'fill' : 'regular');

          return (
            <button
              key={item.id}
              id={tabButtonId}
              ref={(element) => {
                if (element) {
                  buttonRefMap.current.set(item.id, element);
                } else {
                  buttonRefMap.current.delete(item.id);
                }
              }}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={tabPanelId}
              tabIndex={selected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => commitActiveId(item.id)}
              onKeyDown={(event) => handleButtonKeyDown(event, item.id)}
              className={joinClassNames(
                styles.tabButton,
                selected ? styles.tabButtonActive : styles.tabButtonInactive,
                selected ? tabButtonActiveClassName : tabButtonInactiveClassName,
                tabButtonClassName
              )}
            >
              <span
                className={joinClassNames(
                  styles.tabButtonBackground,
                  styles.tabButtonBackgroundInactive,
                  selected ? styles.tabButtonBackgroundHidden : null
                )}
                aria-hidden="true"
              >
                <span className={styles.tabButtonBgFillInactive}></span>
              </span>
              <span
                className={joinClassNames(
                  styles.tabButtonBackground,
                  styles.tabButtonBackgroundActive,
                  selected ? null : styles.tabButtonBackgroundHidden
                )}
                aria-hidden="true"
              >
                <svg
                  className={styles.tabButtonBgEdgeActive}
                  viewBox="0 0 26 30" 
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M26 30H0C4.90037 30 7.35093 29.9996 9.22266 29.0459C10.8688 28.2071 12.2071 26.8688 13.0459 25.2227C13.9996 23.3509 14 20.9004 14 16V9.59961C14 6.23965 14.0004 4.55977 14.6543 3.27637C15.2295 2.14739 16.1474 1.22954 17.2764 0.654297C18.5598 0.000417581 20.2397 9.83795e-10 23.5996 0H26V30Z" fill=" var(--card-bg)" />
                </svg>
                <span className={styles.tabButtonBgFill}></span>
                <svg
                  className={styles.tabButtonBgEdgeActive}
                  viewBox="0 0 26 30" 
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M2.40039 0C5.76035 9.83795e-10 7.44023 0.000417484 8.72363 0.654297C9.85261 1.22954 10.7705 2.14739 11.3457 3.27637C11.9996 4.55977 12 6.23965 12 9.59961V16C12 20.9004 12.0004 23.3509 12.9541 25.2227C13.7929 26.8688 15.1312 28.2071 16.7773 29.0459C18.6491 29.9996 21.0996 30 26 30H0V0H2.40039Z" fill=" var(--card-bg)" />
                </svg>
              </span>
              <span
                className={joinClassNames(
                  styles.tabButtonContent,
                  tabButtonContentClassName
                )}
              >
                {Icon ? (
                  <Icon
                    {...itemIconProps}
                    weight={iconWeight}
                    size={itemIconProps.size ?? 18}
                    className={joinClassNames(
                      styles.tabIcon,
                      iconClassName,
                      itemIconProps.className
                    )}
                  />
                ) : null}
                <span className={styles.tabLabel}>{item.label}</span>
                {addon ? (
                  <span className={joinClassNames(styles.tabAddon, addonClassName)}>
                    {addon}
                  </span>
                ) : null}
              </span>
            </button>
          );
        })}
      </div>

      {renderPanels
        ? items.map((item) => {
          const selected = item.id === currentActiveId;
          const tabButtonId = `${baseId}-tab-${item.id}`;
          const tabPanelId = `${baseId}-panel-${item.id}`;

          return (
            <div
              key={item.id}
              id={tabPanelId}
              role="tabpanel"
              aria-labelledby={tabButtonId}
              hidden={!selected}
              className={joinClassNames(
                styles.tabPanel,
                selected ? styles.tabPanelActive : null,
                selected ? tabPanelActiveClassName : null,
                tabPanelClassName
              )}
            >
              {item.content}
            </div>
          );
        })
        : null}
    </div>
  );
}
