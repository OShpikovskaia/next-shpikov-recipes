'use client';

import { useAuthStore } from '@/modules/auth/model/store';
import { AUTH_STATUS } from '@/shared/model/auth-status';
import EmptyState from '@/shared/ui/EmptyState';

import { IngredientEditor } from '../features/IngredientEditor';
import IngredientsTable from '../ui/IngredientsTable';

const IngredientsManager = () => {
  const { isAuth, status } = useAuthStore();

  if (status === AUTH_STATUS.LOADING) {
    return (
      <div className="flex w-full justify-center py-16">
        <p className="text-sm text-gray-500">Checking access…</p>
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

  return (
    <div>
      <IngredientEditor />
      <IngredientsTable />
    </div>
  );
};

export default IngredientsManager;
