'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { SortDescriptor } from '@heroui/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useIngredientStore } from '@/modules/ingredient/model/store';
import { getFilteredAndSortedIngredients } from '@/modules/ingredient/model/utils';
import { AUTH_STATUS } from '@/shared/model/auth-status';
import EmptyState from '@/shared/ui/EmptyState';

import { useIngredientActions } from '../model/hooks/useIngredientActions';

const IngredientsTable = dynamic(() => import('../ui/IngredientsTable'), {
  ssr: false,
  loading: () => (
    <div className="mt-4 flex w-full justify-center">
      <p className="text-default-500 text-sm">Loading table…</p>
    </div>
  ),
});

const IngredientEditor = dynamic(() => import('../features/IngredientEditor'), {
  ssr: false,
  loading: () => (
    <div className="mt-4">
      <p className="text-default-500 text-sm">Loading editor…</p>
    </div>
  ),
});

const IngredientsManager = () => {
  const status = useAuthStore((state) => state.status);
  const isAuth = useAuthStore((state) => state.isAuth);
  const currentUserId = useAuthStore((s) => s.session?.user?.id ?? null);

  const { removeIngredient } = useIngredientActions();

  const ingredients = useIngredientStore((state) => state.ingredients);
  const isLoading = useIngredientStore((state) => state.isLoading);
  const error = useIngredientStore((state) => state.error);

  const [searchValue, setSearchValue] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const isInitial = ingredients === null;

  if (status === AUTH_STATUS.LOADING) {
    return (
      <div className="mt-4 flex w-full justify-center">
        <p className="text-default-500 text-sm">Syncing list of ingredients…</p>
      </div>
    );
  }

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

  if (isInitial) {
    return (
      <div className="mt-4 flex w-full justify-center">
        <p className="text-default-500 text-sm">Loading ingredients...</p>
      </div>
    );
  }

  const filteredAndSorted = getFilteredAndSortedIngredients({
    ingredients,
    searchValue,
    sortDescriptor,
  });

  const handleDelete = async (id: string) => {
    await removeIngredient(id);
  };

  return (
    <>
      <IngredientEditor />

      <IngredientsTable
        rows={filteredAndSorted}
        totalCount={ingredients?.length ?? 0}
        isLoading={isLoading}
        error={error}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        sortDescriptor={sortDescriptor}
        onSortChange={setSortDescriptor}
        onDelete={handleDelete}
        currentUserId={currentUserId}
      />
    </>
  );
};

export default IngredientsManager;
