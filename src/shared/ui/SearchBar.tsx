'use client';

import type { ChangeEventHandler } from 'react';
import { Input } from '@heroui/react';
import clsx from 'clsx';

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  'aria-label'?: string;
};

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  size = 'sm',
  'aria-label': ariaLabel,
}: SearchBarProps) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChange(e.target.value);
  };

  return (
    <div className={clsx(className)}>
      <Input
        size={size}
        isClearable
        value={value}
        onChange={handleChange}
        onClear={() => onChange('')}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
      />
    </div>
  );
};
