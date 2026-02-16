import type { FC } from 'react';
import { Skeleton } from '@heroui/skeleton';

const ListCountInfoSkeleton: FC<{ className?: string }> = ({ className }) => {
  return <Skeleton className={`h-4 w-44 rounded-md ${className ?? ''}`} />;
};

export default ListCountInfoSkeleton;
