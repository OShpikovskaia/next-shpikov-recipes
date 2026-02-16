import type { FC } from 'react';
import { Skeleton } from '@heroui/skeleton';

const SearchBarSkeleton: FC<{ className?: string }> = ({ className }) => {
  return <Skeleton className={`h-9 w-full rounded-xl ${className ?? ''}`} />;
};

export default SearchBarSkeleton;
