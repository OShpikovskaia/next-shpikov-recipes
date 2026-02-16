'use client';

import type { FC } from 'react';
import clsx from 'clsx';

interface ListCountInfoProps {
  total: number;
  visible: number;
  label: string;
  className?: string;
}

export const ListCountInfo: FC<ListCountInfoProps> = ({ total, visible, label, className }) => {
  if (total <= 0) return null;

  const safeVisible = Math.min(Math.max(visible, 0), total);
  const isFullListVisible = safeVisible === total;

  return (
    <p className={clsx('text-xs', className)}>
      Showing <span className="font-semibold">{total === 0 ? 0 : safeVisible}</span>
      {!isFullListVisible && (
        <>
          {' of '}
          <span className="font-semibold">{total}</span>
        </>
      )}{' '}
      {label}
    </p>
  );
};
