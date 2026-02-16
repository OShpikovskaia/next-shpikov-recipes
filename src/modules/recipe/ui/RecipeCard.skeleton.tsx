import { Card } from '@heroui/card';
import { Skeleton } from '@heroui/skeleton';

const RecipeCardSkeleton = () => {
  return (
    <Card className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-100 p-0 shadow-sm">
      {/* RecipeImage */}
      <Skeleton className="aspect-video w-full" />

      <div className="flex flex-1 flex-col gap-3 px-4 py-4">
        {/* Header & badge of visible */}
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-6 w-2/3 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-5/6 rounded-md" />
        </div>

        {/* Ingredients */}
        <div className="mt-2">
          <Skeleton className="mb-2 h-3 w-20 rounded-md" />
          <div className="space-y-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between gap-2">
                <Skeleton className="h-4 flex-1 rounded-md" />
                <Skeleton className="h-4 w-12 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-2 border-t border-gray-100 px-4 py-3">
        <Skeleton className="h-8 w-16 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-14 rounded-xl" />
          <Skeleton className="h-8 w-14 rounded-xl" />
        </div>
      </div>
    </Card>
  );
};

export default RecipeCardSkeleton;
