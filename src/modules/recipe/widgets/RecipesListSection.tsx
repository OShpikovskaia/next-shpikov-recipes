'use client';

import type { FC } from 'react';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useRecipeStore } from '@/modules/recipe/model/store';
import RecipeCard from '@/modules/recipe/ui/RecipeCard';
import EmptyState from '@/shared/ui/EmptyState';
import { ListCountInfo } from '@/shared/ui/ListCountInfo';
import { SearchBar } from '@/shared/ui/SearchBar';

import type { FilterType, IRecipe } from '../model/type';
import { useRecipesListState } from '../model/useRecipesListState';
import { RecipeFilterTabs } from '../ui/RecipeFilterTabs';

interface RecipesListSectionProps {
  initialRecipes: IRecipe[];
}

const RecipesListSection: FC<RecipesListSectionProps> = ({ initialRecipes }) => {
  const { recipes: storeRecipes, isLoading, error } = useRecipeStore();
  const { isAuth, session } = useAuthStore();
  const currentUserId = session?.user?.id ?? null;

  const recipes = storeRecipes ?? initialRecipes;

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

  const showInitialLoading = storeRecipes === null && initialRecipes.length === 0 && isLoading;

  if (showInitialLoading) {
    return (
      <div className="flex w-full justify-center py-16">
        <p className="text-sm text-gray-500">Loading recipes...</p>
      </div>
    );
  }

  if (error && !hasRecipes) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <EmptyState
          variant="generic"
          title="Error loading recipes"
          description={error}
          primaryActionLabel="Try again"
          primaryActionHref="/"
        />
      </div>
    );
  }

  if (!hasRecipes && !isLoading && !error) {
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

  const showSearchEmptyState =
    hasRecipes && !isLoading && searchQuery.trim().length > 0 && filteredRecipes.length === 0;

  return (
    <div className="flex w-full flex-col gap-6 pb-12">
      {isAuth && (
        <>
          <Link href="/recipes/new" className="mb-2 flex w-full">
            <Button color="primary" className="w-full">
              Add recipe
            </Button>
          </Link>

          {hasRecipes && (
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
              <span>
                Public: <span className="font-semibold text-gray-700">{publicCount}</span>
                {' · '}My private:{' '}
                <span className="font-semibold text-gray-700">{myPrivateCount}</span>
              </span>
            </div>
          )}

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
          aria-label="Search recipes"
        />

        {hasRecipes && (
          <ListCountInfo
            total={totalInCurrentFilter}
            visible={filteredRecipes.length}
            label="recipes"
            className="text-gray-500"
          />
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {isLoading && hasRecipes && <p className="text-xs text-gray-400">Updating recipes…</p>}

      {showSearchEmptyState ? (
        <div className="mx-auto w-full max-w-3xl">
          <EmptyState
            variant="generic"
            title="No recipes found"
            description={`No recipes match “${searchQuery.trim()}”. Try a different name.`}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRecipes.map((recipe) => (
            <RecipeCard recipe={recipe} key={recipe.id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RecipesListSection;
