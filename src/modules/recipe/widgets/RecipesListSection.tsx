'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useRecipeStore } from '@/modules/recipe/model/store';
import RecipeCard from '@/modules/recipe/ui/RecipeCard';
import EmptyState from '@/shared/ui/EmptyState';

import type { FilterType } from '../model/type';
import { getVisibleRecipes } from '../model/utils';
import { RecipeFilterTabs } from '../ui/RecipeFilterTabs';
import { RecipeSearchBar } from '../ui/RecipeSearchBar';

const RecipesListSection = () => {
  const { recipes, isLoading, error } = useRecipeStore();
  const { isAuth, session } = useAuthStore();

  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const isInitial = recipes === null;
  const hasRecipes = Array.isArray(recipes) && recipes.length > 0;

  const currentUserId = session?.user?.id ?? null;

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];

    const base = getVisibleRecipes({ recipes, isAuth, filter, currentUserId });

    const q = searchQuery.trim().toLowerCase();
    if (!q) return base;

    return base.filter((recipe) => recipe.name.toLowerCase().includes(q));
  }, [recipes, isAuth, filter, currentUserId, searchQuery]);

  const { publicCount, myPrivateCount } = useMemo(() => {
    if (!recipes) {
      return { publicCount: 0, myPrivateCount: 0 };
    }

    const publicCount = recipes.filter((r) => r.isPublic).length;

    const myPrivateCount =
      currentUserId != null
        ? recipes.filter((r) => !r.isPublic && r.authorId === currentUserId).length
        : 0;

    return { publicCount, myPrivateCount };
  }, [recipes, currentUserId]);

  const showSearchEmptyState =
    hasRecipes && !isLoading && searchQuery.trim().length > 0 && filteredRecipes.length === 0;

  if (isInitial) {
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
        <RecipeSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:max-w-xs"
        />

        {hasRecipes && (
          <p className="text-xs text-gray-500">
            Showing <span className="font-semibold text-gray-700">{filteredRecipes.length}</span>
            {recipes && (
              <>
                {' '}
                of <span className="font-semibold text-gray-700">{recipes.length}</span>
              </>
            )}{' '}
            recipes
          </p>
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
