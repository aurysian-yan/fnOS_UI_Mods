import React from 'react';

export type SwitchVariant = 'default' | 'masked';

export interface SwitchProps {
  labelClassName?: string;
  sliderClassName?: string;
  variant?: SwitchVariant;
  [key: string]: unknown;
}

function joinClassNames(
  ...classNames: Array<string | undefined | null | false>
): string {
  return classNames.filter(Boolean).join(' ');
}

export function Switch({
  labelClassName,
  sliderClassName,
  variant = 'default',
  ...inputProps
}: SwitchProps) {
  return (
    <label className={joinClassNames('switch', labelClassName)}>
      <input type="checkbox" {...inputProps} />
      <span className={joinClassNames('slider', sliderClassName)}>
      </span>
    </label>
  );
}
