'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import type { SortDescriptor } from '@heroui/react';
import { Skeleton } from '@heroui/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useIngredientStore } from '@/modules/ingredient/model/store';
import { getFilteredAndSortedIngredients } from '@/modules/ingredient/model/utils';
import { AUTH_STATUS } from '@/shared/model/auth-status';
import EmptyState from '@/shared/ui/EmptyState';

import { useIngredientActions } from '../model/hooks/useIngredientActions';

const IngredientsTable = dynamic(() => import('../ui/IngredientsTable'), {
  ssr: false,
  loading: () => <IngredientsTableSkeleton />,
});

const IngredientEditor = dynamic(() => import('../features/IngredientEditor'), {
  ssr: false,
  loading: () => <IngredientEditorSkeleton />,
});

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

function IngredientsPageSkeleton() {
  return (
    <div className="w-full">
      {/* we assume title is on the page already, so skeleton for content only */}
      <div className="space-y-6">
        <IngredientEditorSkeleton />
        <IngredientsTableSkeleton />
      </div>
    </div>
  );
}

const IngredientsManager = () => {
  // auth
  const authStatus = useAuthStore((s) => s.status);
  const isAuth = useAuthStore((s) => s.isAuth);
  const currentUserId = useAuthStore((s) => s.session?.user?.id ?? null);

  // ingredients store
  const ingredientStatus = useIngredientStore((s) => s.status); // 'idle' | 'loading' | 'success' | 'error'
  const ingredients = useIngredientStore((s) => s.ingredients); // array
  const error = useIngredientStore((s) => s.error);

  const { removeIngredient } = useIngredientActions();

  const [searchValue, setSearchValue] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  // hooks always called
  const filteredAndSorted = useMemo(
    () =>
      getFilteredAndSortedIngredients({
        ingredients,
        searchValue,
        sortDescriptor,
      }),
    [ingredients, searchValue, sortDescriptor],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      await removeIngredient(id);
    },
    [removeIngredient],
  );

  // 1) auth is hydrating -> show page skeleton instead of a text-only loader
  if (authStatus === AUTH_STATUS.LOADING) {
    return <IngredientsPageSkeleton />;
  }

  // 2) unauthorized
  if (!isAuth) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <EmptyState
          variant="unauthorized"
          title="Sign in to manage ingredients"
          description="Create and edit ingredients only when you’re signed in."
          primaryActionLabel="Sign in"
          primaryActionHref="/"
        />
      </div>
    );
  }

  // 3) authenticated: show editor immediately; table can be loading
  const isTableLoading = ingredientStatus === 'idle' || ingredientStatus === 'loading';

  return (
    <>
      <IngredientEditor />

      {ingredientStatus === 'error' ? (
        <div className="border-danger-200 bg-danger-50 text-danger mt-6 rounded-2xl border p-4 text-sm">
          {error ?? 'Failed to load ingredients.'}
        </div>
      ) : (
        <IngredientsTable
          rows={isTableLoading ? [] : filteredAndSorted}
          totalCount={isTableLoading ? 0 : ingredients.length}
          error={null}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          sortDescriptor={sortDescriptor}
          onSortChange={setSortDescriptor}
          onDelete={handleDelete}
          currentUserId={currentUserId}
        />
      )}
    </>
  );
};

export default IngredientsManager;
