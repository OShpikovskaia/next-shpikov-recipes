'use client';

import type { ChangeEventHandler, FC } from 'react';
import { Input } from '@heroui/react';

interface RecipeSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const RecipeSearchBar: FC<RecipeSearchBarProps> = ({ value, onChange, className }) => {
  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    onChange(target.value);
  };

  return (
    <div className={className}>
      <Input
        size="sm"
        value={value}
        onChange={handleChange}
        placeholder="Search recipes by name..."
        aria-label="Search recipes by name"
      />
    </div>
  );
};
