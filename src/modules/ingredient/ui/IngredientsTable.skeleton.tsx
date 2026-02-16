import { Skeleton } from '@heroui/skeleton';

function IngredientsTableSkeleton() {
  return (
    <div className="mt-6 w-full">
      {/* table card */}
      <div className="border-default-200 mt-4 rounded-2xl border bg-white">
        <div className="border-default-200 border-b p-4">
          <Skeleton className="h-4 w-48 rounded-lg" />
        </div>

        <div className="p-4">
          <div className="space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <div className="border-default-200 border-t p-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32 rounded-lg" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-24 rounded-xl" />
              <Skeleton className="h-9 w-24 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default IngredientsTableSkeleton;
