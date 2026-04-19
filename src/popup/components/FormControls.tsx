import {
  Checkbox,
  Field,
  HStack,
  Input,
  NativeSelect,
  RadioCard,
  Stack,
  Text,
  Textarea
} from "@chakra-ui/react";
import { type KeyboardEventHandler, type ReactNode } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { PopupSwitch } from "./PopupSwitch";

interface SwitchRowProps {
  title: string;
  description?: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export function SwitchRow({
  title,
  description,
  checked,
  disabled,
  onChange
}: SwitchRowProps) {
  return (
    <HStack align="start" justify="space-between" gap="4">
      <Stack gap="1" flex="1">
        <Text fontWeight="medium">{title}</Text>
        {description ? (
          <Text color="fg.muted" textStyle="sm">
            {description}
          </Text>
        ) : null}
      </Stack>
      <PopupSwitch checked={checked} disabled={disabled} onChange={onChange} />
    </HStack>
  );
}

interface RadioCardOption<T extends string> {
  value: T;
  title: string;
  description: string;
}

interface RadioCardGroupProps<T extends string> {
  name: string;
  value: T;
  disabled?: boolean;
  options: RadioCardOption<T>[];
  onChange: (value: T) => void;
}

export function RadioCardGroup<T extends string>({
  name,
  value,
  disabled,
  options,
  onChange
}: RadioCardGroupProps<T>) {
  return (
    <RadioCard.Root
      name={name}
      value={value}
      disabled={disabled}
      orientation="vertical"
      align="start"
      onValueChange={(details) => onChange(details.value as T)}
    >
      <Stack gap="3">
        {options.map((option) => (
          <RadioCard.Item key={option.value} value={option.value}>
            <RadioCard.ItemHiddenInput />
            <RadioCard.ItemControl>
              <RadioCard.ItemContent>
                <RadioCard.ItemText>{option.title}</RadioCard.ItemText>
                <RadioCard.ItemDescription>{option.description}</RadioCard.ItemDescription>
              </RadioCard.ItemContent>
              <RadioCard.ItemIndicator />
            </RadioCard.ItemControl>
          </RadioCard.Item>
        ))}
      </Stack>
    </RadioCard.Root>
  );
}

interface FieldProps {
  label: string;
  hint?: string;
  children: ReactNode;
}

export function FormField({ label, hint, children }: FieldProps) {
  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      {children}
      {hint ? <Field.HelperText>{hint}</Field.HelperText> : null}
    </Field.Root>
  );
}

interface TextInputFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
  hint?: string;
  onChange: (value: string) => void;
  onCommit?: () => void;
}

export function TextInputField({
  label,
  value,
  placeholder,
  type = "text",
  disabled,
  hint,
  onChange,
  onCommit
}: TextInputFieldProps) {
  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    onCommit?.();
  };

  return (
    <FormField label={label} hint={hint}>
      <Input
        type={type}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(event) => onChange(event.currentTarget.value)}
        onBlur={onCommit}
        onKeyDown={handleKeyDown}
      />
    </FormField>
  );
}

interface TextAreaFieldProps {
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  hint?: string;
  onChange: (value: string) => void;
  onCommit?: () => void;
}

export function TextAreaField({
  label,
  value,
  placeholder,
  disabled,
  hint,
  onChange,
  onCommit
}: TextAreaFieldProps) {
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    if (event.key !== "Enter" || (!event.ctrlKey && !event.metaKey)) return;
    event.preventDefault();
    onCommit?.();
  };

  return (
    <FormField label={label} hint={hint}>
      <Textarea
        minH="28"
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        spellCheck={false}
        onChange={(event) => onChange(event.currentTarget.value)}
        onBlur={onCommit}
        onKeyDown={handleKeyDown}
      />
    </FormField>
  );
}

interface SelectFieldProps {
  label: string;
  hint?: string;
  value: string;
  disabled?: boolean;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
}

export function SelectField({
  label,
  hint,
  value,
  disabled,
  options,
  onChange
}: SelectFieldProps) {
  return (
    <FormField label={label} hint={hint}>
      <NativeSelect.Root disabled={disabled}>
        <NativeSelect.Field value={value} onChange={(event) => onChange(event.currentTarget.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </NativeSelect.Field>
        <NativeSelect.Indicator>
          <CaretDown />
        </NativeSelect.Indicator>
      </NativeSelect.Root>
    </FormField>
  );
}

interface CheckboxRowProps {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxRow({ label, checked, disabled, onChange }: CheckboxRowProps) {
  return (
    <Checkbox.Root
      checked={checked}
      disabled={disabled}
      onCheckedChange={(details) => onChange(Boolean(details.checked))}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>{label}</Checkbox.Label>
    </Checkbox.Root>
  );
}
