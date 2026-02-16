'use client';

import type { FC } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/button';

import { useAuthStore } from '@/modules/auth/model/store';
import RecipeCard from '@/modules/recipe/ui/RecipeCard';
import { AUTH_STATUS } from '@/shared/model/auth-status';
import EmptyState from '@/shared/ui/EmptyState';
import { ListCountInfo } from '@/shared/ui/ListCountInfo';
import { SearchBar } from '@/shared/ui/SearchBar';

import { useRecipesListState } from '../model/hooks/useRecipesListState';
import type { FilterType, IRecipe } from '../model/types';
import { RecipeFilterTabs } from '../ui/RecipeFilterTabs';

interface RecipesListSectionProps {
  initialRecipes: IRecipe[];
  isAuthInitial?: boolean;
  currentUserIdInitial?: string | null;
}

const RecipesListSection: FC<RecipesListSectionProps> = ({
  initialRecipes,
  isAuthInitial,
  currentUserIdInitial,
}) => {
  const storeIsAuth = useAuthStore((s) => s.isAuth);
  const storeStatus = useAuthStore((s) => s.status);
  const storeSession = useAuthStore((s) => s.session);

  const isHydratingAuth = storeStatus === AUTH_STATUS.LOADING;

  const isAuth = isHydratingAuth ? (isAuthInitial ?? false) : storeIsAuth;
  const currentUserId = isHydratingAuth
    ? (currentUserIdInitial ?? null)
    : (storeSession?.user?.id ?? null);

  const recipes = initialRecipes;

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { hasRecipes, filteredRecipes, publicCount, myPrivateCount, totalInCurrentFilter } =
    useRecipesListState({
      recipes,
      isAuth,
      currentUserId,
      filter,
      searchQuery,
    });

  if (!hasRecipes) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <EmptyState
          variant="noRecipes"
          title="No recipes yet"
          description={
            isAuth
              ? 'Create your first recipe to start your collection.'
              : 'There are no recipes yet.'
          }
          primaryActionLabel={isAuth ? 'Create first recipe' : undefined}
          primaryActionHref={isAuth ? '/recipes/new' : undefined}
        />
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {isAuth && (
        <>
          <Link href="/recipes/new" className="mb-2 flex w-full">
            <Button color="primary" className="w-full">
              Add recipe
            </Button>
          </Link>

          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span>
              Public: <span className="font-semibold text-gray-700">{publicCount}</span>
              {' · '}My private:{' '}
              <span className="font-semibold text-gray-700">{myPrivateCount}</span>
            </span>
          </div>

          <RecipeFilterTabs value={filter} onChange={setFilter} />
        </>
      )}

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:max-w-xs"
          placeholder="Search recipes..."
          size="sm"
        />

        <ListCountInfo
          total={totalInCurrentFilter}
          visible={filteredRecipes.length}
          label="recipes"
          className="text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </div>
  );
};

export default RecipesListSection;
