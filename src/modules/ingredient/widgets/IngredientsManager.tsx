'use client';

import { useState } from 'react';
import type { SortDescriptor } from '@heroui/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useIngredientStore } from '@/modules/ingredient/model/store';
import { getFilteredAndSortedIngredients } from '@/modules/ingredient/model/utils';
import { AUTH_STATUS } from '@/shared/model/auth-status';
import EmptyState from '@/shared/ui/EmptyState';

import { IngredientEditor } from '../features/IngredientEditor';
import IngredientsTable from '../ui/IngredientsTable';

const IngredientsManager = () => {
  const { status, isAuth } = useAuthStore();
  const { ingredients, removeIngredient, isLoading, error } = useIngredientStore();

  const [searchValue, setSearchValue] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const isInitial = ingredients === null;

  if (status === AUTH_STATUS.LOADING) {
    return (
      <div className="mt-4 flex w-full justify-center">
        <p className="text-default-500 text-sm">Checking your access…</p>
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
      />
    </>
  );
};

export default IngredientsManager;
