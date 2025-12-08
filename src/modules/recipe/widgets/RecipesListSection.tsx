'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@heroui/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useRecipeStore } from '@/modules/recipe/model/store';
import RecipeCard from '@/modules/recipe/ui/RecipeCard';
import EmptyState from '@/shared/ui/EmptyState';

type RecipeFilter = 'all' | 'public' | 'mine';

const RecipesListSection = () => {
  const { recipes, isLoading, error } = useRecipeStore();
  const { isAuth, session } = useAuthStore();
  const [filter, setFilter] = useState<RecipeFilter>('all');

  const hasRecipes = Array.isArray(recipes) && recipes.length > 0;
  const isInitial = recipes === null;
  const currentUserId = session?.user?.id ?? null;

  const filteredRecipes = useMemo(() => {
    if (!recipes) return [];

    if (!isAuth) {
      return recipes.filter((recipe) => recipe.isPublic);
    }

    switch (filter) {
      case 'public':
        return recipes.filter((recipe) => recipe.isPublic);
      case 'mine':
        return recipes.filter((recipe) => recipe.authorId && recipe.authorId === currentUserId);
      case 'all':
      default:
        return recipes;
    }
  }, [recipes, filter, isAuth, currentUserId]);

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

          <div className="mb-2 flex items-center justify-between gap-3 text-xs">
            <span className="text-gray-500">Show:</span>
            <div className="inline-flex rounded-full border border-gray-200 bg-white p-1">
              <button
                type="button"
                className={[
                  'rounded-full px-3 py-1',
                  filter === 'all' ? 'bg-primary text-xs text-white' : 'text-gray-600',
                ].join(' ')}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button
                type="button"
                className={[
                  'rounded-full px-3 py-1',
                  filter === 'public' ? 'bg-primary text-xs text-white' : 'text-gray-600',
                ].join(' ')}
                onClick={() => setFilter('public')}
              >
                Public
              </button>
              <button
                type="button"
                className={[
                  'rounded-full px-3 py-1',
                  filter === 'mine' ? 'bg-primary text-xs text-white' : 'text-gray-600',
                ].join(' ')}
                onClick={() => setFilter('mine')}
              >
                Only mine
              </button>
            </div>
          </div>
        </>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {isLoading && hasRecipes && <p className="text-xs text-gray-400">Updating recipes…</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRecipes.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </div>
  );
};

export default RecipesListSection;
