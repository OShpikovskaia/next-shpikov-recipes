import { Skeleton } from '@heroui/skeleton';

function IngredientEditorSkeleton() {
  return (
    <div className="mx-auto w-full max-w-xl pb-16">
      <div className="flex w-full flex-col gap-6">
        {/* Name */}
        <Skeleton className="h-10 w-full rounded-2xl" />

        {/* Row: Category / Unit / Price */}
        <div className="flex w-full flex-col items-start gap-2 md:flex-row">
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>

        {/* Description */}
        <Skeleton className="h-10 w-full rounded-2xl" />

        {/* Submit */}
        <div className="flex w-full">
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default IngredientEditorSkeleton;
