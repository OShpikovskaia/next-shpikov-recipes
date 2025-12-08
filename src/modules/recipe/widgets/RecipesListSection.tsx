'use client';

import Link from 'next/link';
import { Button } from '@heroui/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useRecipeStore } from '@/modules/recipe/model/store';
import RecipeCard from '@/modules/recipe/ui/RecipeCard';
import EmptyState from '@/shared/ui/EmptyState';

const RecipesListSection = () => {
  const { recipes, isLoading, error } = useRecipeStore();
  const { isAuth } = useAuthStore();

  const hasRecipes = Array.isArray(recipes) && recipes.length > 0;
  const isInitial = recipes === null;

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
        <div className="flex justify-end">
          <Link href="/recipes/new">
            <Button color="primary">Add recipe</Button>
          </Link>
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}

      {isLoading && hasRecipes && <p className="text-xs text-gray-400">Updating recipes…</p>}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recipes!.map((recipe) => (
          <RecipeCard recipe={recipe} key={recipe.id} />
        ))}
      </div>
    </div>
  );
};

export default RecipesListSection;
