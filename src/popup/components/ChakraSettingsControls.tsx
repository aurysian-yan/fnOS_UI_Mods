import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Radio,
  RadioGroup,
  Select,
  Stack,
  useDisclosure
} from '@chakra-ui/react';

const CHAKRA_SYNC_EVENT = 'popup:chakra-sync';

function dispatchNativeEvent(element: HTMLElement, type: 'input' | 'change') {
  element.dispatchEvent(new Event(type, { bubbles: true }));
}

interface RadioOptionModel {
  id: string;
  value: string;
  title: string;
  description: string;
  inputElement: HTMLInputElement;
}

interface SelectOptionModel {
  value: string;
  label: string;
}

export interface ChakraBrandColorPickerProps {
  nativeInput: HTMLInputElement;
}

export function ChakraBrandColorPicker({ nativeInput }: ChakraBrandColorPickerProps) {
  const [value, setValue] = useState(nativeInput.value || '#0066ff');
  const [disabled, setDisabled] = useState(Boolean(nativeInput.disabled));

  const syncFromNative = useCallback(() => {
    setValue(nativeInput.value || '#0066ff');
    setDisabled(Boolean(nativeInput.disabled));
  }, [nativeInput]);

  useEffect(() => {
    syncFromNative();
    const handleNativeUpdate = () => syncFromNative();
    nativeInput.addEventListener('input', handleNativeUpdate);
    nativeInput.addEventListener('change', handleNativeUpdate);
    document.addEventListener(CHAKRA_SYNC_EVENT, handleNativeUpdate);

    return () => {
      nativeInput.removeEventListener('input', handleNativeUpdate);
      nativeInput.removeEventListener('change', handleNativeUpdate);
      document.removeEventListener(CHAKRA_SYNC_EVENT, handleNativeUpdate);
    };
  }, [nativeInput, syncFromNative]);

  return (
    <Input
      aria-label="主题色选择"
      type="color"
      size="sm"
      value={value}
      isDisabled={disabled}
      w="38px"
      h="28px"
      borderColor="var(--card-border)"
      bg="transparent"
      p="1px"
      borderRadius="8px"
      cursor={disabled ? 'not-allowed' : 'pointer'}
      onInput={(event) => {
        const next = event.currentTarget.value;
        setValue(next);
        nativeInput.value = next;
        dispatchNativeEvent(nativeInput, 'input');
      }}
      onChange={(event) => {
        const next = event.currentTarget.value;
        setValue(next);
        nativeInput.value = next;
        dispatchNativeEvent(nativeInput, 'change');
      }}
    />
  );
}

export interface ChakraNativeRadioGroupProps {
  options: RadioOptionModel[];
}

export function ChakraNativeRadioGroup({ options }: ChakraNativeRadioGroupProps) {
  const [selectedValue, setSelectedValue] = useState('');
  const [disabledById, setDisabledById] = useState<Record<string, boolean>>({});

  const syncFromNative = useCallback(() => {
    const checkedOption = options.find((option) => option.inputElement.checked);
    setSelectedValue(checkedOption?.value ?? options[0]?.value ?? '');
    const disabledState: Record<string, boolean> = {};
    for (const option of options) {
      disabledState[option.id] = Boolean(option.inputElement.disabled);
    }
    setDisabledById(disabledState);
  }, [options]);

  useEffect(() => {
    syncFromNative();
    const handleNativeUpdate = () => syncFromNative();
    for (const option of options) {
      option.inputElement.addEventListener('change', handleNativeUpdate);
    }
    document.addEventListener(CHAKRA_SYNC_EVENT, handleNativeUpdate);

    return () => {
      for (const option of options) {
        option.inputElement.removeEventListener('change', handleNativeUpdate);
      }
      document.removeEventListener(CHAKRA_SYNC_EVENT, handleNativeUpdate);
    };
  }, [options, syncFromNative]);

  return (
    <RadioGroup
      value={selectedValue}
      onChange={(nextValue) => {
        const target = options.find((option) => option.value === nextValue);
        if (!target || target.inputElement.disabled) return;
        for (const option of options) {
          option.inputElement.checked = option.id === target.id;
        }
        setSelectedValue(nextValue);
        dispatchNativeEvent(target.inputElement, 'change');
      }}
    >
      <Stack spacing={0}>
        {options.map((option, index) => (
          <Box
            key={option.id}
            borderTop={index === 0 ? 'none' : '1px solid var(--card-border)'}
            px="12px"
            py="10px"
            bg="var(--bg)"
          >
            <Radio
              value={option.value}
              isDisabled={Boolean(disabledById[option.id])}
              alignItems="flex-start"
              sx={{
                '.chakra-radio__control[data-checked]': {
                  bg: 'var(--switch-on)',
                  borderColor: 'var(--switch-on)'
                },
                '.chakra-radio__control': {
                  mt: '2px'
                }
              }}
            >
              <Box pl="2px">
                <Box className="platform-title">{option.title}</Box>
                <Box className="platform-desc">{option.description}</Box>
              </Box>
            </Radio>
          </Box>
        ))}
      </Stack>
    </RadioGroup>
  );
}

export interface ChakraNativeSelectProps {
  nativeSelect: HTMLSelectElement;
  options: SelectOptionModel[];
}

export function ChakraNativeSelect({ nativeSelect, options }: ChakraNativeSelectProps) {
  const [value, setValue] = useState(nativeSelect.value || options[0]?.value || '');
  const [disabled, setDisabled] = useState(Boolean(nativeSelect.disabled));

  const syncFromNative = useCallback(() => {
    setValue(nativeSelect.value || options[0]?.value || '');
    setDisabled(Boolean(nativeSelect.disabled));
  }, [nativeSelect, options]);

  useEffect(() => {
    syncFromNative();
    const handleNativeUpdate = () => syncFromNative();
    nativeSelect.addEventListener('change', handleNativeUpdate);
    document.addEventListener(CHAKRA_SYNC_EVENT, handleNativeUpdate);

    return () => {
      nativeSelect.removeEventListener('change', handleNativeUpdate);
      document.removeEventListener(CHAKRA_SYNC_EVENT, handleNativeUpdate);
    };
  }, [nativeSelect, syncFromNative]);

  return (
    <Select
      value={value}
      isDisabled={disabled}
      onChange={(event) => {
        const next = event.target.value;
        setValue(next);
        nativeSelect.value = next;
        dispatchNativeEvent(nativeSelect, 'change');
      }}
      fontSize="13px"
      borderColor="var(--card-border)"
      bg="var(--card-bg)"
      color="var(--text)"
      _focusVisible={{
        borderColor: 'var(--switch-on)',
        boxShadow: '0 0 0 1px var(--switch-on)'
      }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </Select>
  );
}

export interface LaunchpadPerfectIconDrawerProps {
  settingsSection: HTMLElement;
}

export function LaunchpadPerfectIconDrawer({
  settingsSection
}: LaunchpadPerfectIconDrawerProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hiddenHostRef = useRef<HTMLDivElement | null>(null);
  const drawerContentHostRef = useRef<HTMLDivElement | null>(null);

  const mountSection = useCallback(
    (target: HTMLElement | null) => {
      if (!target) return;
      if (settingsSection.parentElement === target) return;
      target.appendChild(settingsSection);
    },
    [settingsSection]
  );

  useEffect(() => {
    settingsSection.classList.add('launchpad-extra-settings-in-drawer');
    mountSection(hiddenHostRef.current);
    return () => {
      settingsSection.classList.remove('launchpad-extra-settings-in-drawer');
    };
  }, [mountSection, settingsSection]);

  useEffect(() => {
    if (isOpen) {
      mountSection(drawerContentHostRef.current);
      return;
    }
    mountSection(hiddenHostRef.current);
  }, [isOpen, mountSection]);

  return (
    <div className="launchpad-drawer-entry">
      <div className="row launchpad-drawer-row">
        <div className="label">
          完美图标
          <div className="sub">优化异形图标，使整体图标形状统一</div>
        </div>
        <button type="button" className="mini-button launchpad-drawer-button" onClick={onOpen}>
          设置
        </button>
      </div>

      <div ref={hiddenHostRef} className="launchpad-drawer-hidden-host"></div>

      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement="right"
        size="md"
        preserveScrollBarGap={false}
      >
        <DrawerOverlay backdropFilter="blur(2px)" />
        <DrawerContent
          bg="var(--card-bg)"
          color="var(--text)"
          borderLeft="1px solid var(--card-border)"
        >
          <DrawerCloseButton />
          <DrawerHeader borderBottom="1px solid var(--card-border)">完美图标设置</DrawerHeader>
          <DrawerBody p="12px">
            <div ref={drawerContentHostRef}></div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
