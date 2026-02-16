import type { FC } from 'react';
import { Skeleton } from '@heroui/skeleton';

const RecipeFilterTabsSkeleton: FC = () => {
  return (
    <div className="flex w-full items-center justify-end">
      <div className="flex items-center gap-2 rounded-full border border-gray-200 p-1">
        <Skeleton className="h-8 w-14 rounded-full" />
        <Skeleton className="h-8 w-16 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>
    </div>
  );
};

export default RecipeFilterTabsSkeleton;
