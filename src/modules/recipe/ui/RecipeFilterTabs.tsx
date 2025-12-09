'use client';

import type { FC } from 'react';
import clsx from 'clsx';

import type { FilterType } from '../model/type';

const getFilterButtonClass = (current: FilterType, value: FilterType) =>
  clsx(
    'rounded-full px-3 py-1 text-xs',
    current === value ? 'bg-primary text-white' : 'text-gray-600',
  );

interface RecipeFilterTabsProps {
  value: FilterType;
  onChange: (next: FilterType) => void;
  className?: string;
}

export const RecipeFilterTabs: FC<RecipeFilterTabsProps> = ({ value, onChange, className }) => {
  return (
    <div className={clsx('mb-2 flex items-center justify-between gap-3 text-xs', className)}>
      <span className="text-gray-500">Show:</span>
      <div className="inline-flex rounded-full border border-gray-200 bg-white p-1">
        <button
          type="button"
          className={getFilterButtonClass(value, 'all')}
          onClick={() => onChange('all')}
        >
          All
        </button>
        <button
          type="button"
          className={getFilterButtonClass(value, 'public')}
          onClick={() => onChange('public')}
        >
          Public
        </button>
        <button
          type="button"
          className={getFilterButtonClass(value, 'mine')}
          onClick={() => onChange('mine')}
        >
          Only mine
        </button>
      </div>
    </div>
  );
};
