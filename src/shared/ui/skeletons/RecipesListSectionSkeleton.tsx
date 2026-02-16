import type { FC } from 'react';
import { Skeleton } from '@heroui/skeleton';

import ListCountInfoSkeleton from './ListCountInfoSkeleton';
import RecipeCardSkeleton from './RecipeCardSkeleton';
import RecipeFilterTabsSkeleton from './RecipeFilterTabsSkeleton';
import SearchBarSkeleton from './SearchBarSkeleton';

interface RecipesListSectionSkeletonProps {
  isAuth?: boolean;
  cardsCount?: number;
}

export const RecipesListSectionSkeleton: FC<RecipesListSectionSkeletonProps> = ({
  isAuth = true,
  cardsCount = 3,
}) => {
  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {isAuth && (
        <>
          {/* Link + Button (Add recipe) */}
          <div className="mb-2 flex w-full">
            <Skeleton className="h-10 w-full rounded-xl" />
          </div>

          {/* Public / My private line */}
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span className="inline-flex items-center gap-2">
              <Skeleton className="h-4 w-14 rounded-md" />
              <Skeleton className="h-4 w-6 rounded-md" />
              <Skeleton className="h-4 w-2 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
              <Skeleton className="h-4 w-6 rounded-md" />
            </span>
          </div>

          {/* RecipeFilterTabs */}
          <RecipeFilterTabsSkeleton />
        </>
      )}

      {/* Search + ListCountInfo row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchBarSkeleton className="sm:max-w-xs" />

        <ListCountInfoSkeleton className="text-gray-500" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: cardsCount }).map((_, idx) => (
          <RecipeCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  );
};
