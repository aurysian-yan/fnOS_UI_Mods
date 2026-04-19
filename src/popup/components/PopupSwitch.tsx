interface PopupSwitchProps {
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export function PopupSwitch({ checked, disabled, onChange }: PopupSwitchProps) {
  return (
    <label className="popup-switch">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.checked)}
      />
      <span className="popup-switch__slider" />
    </label>
  );
}
