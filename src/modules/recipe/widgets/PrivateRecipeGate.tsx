'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import { getRecipeById } from '@/modules/recipe/model/server-actions';
import type { IRecipe } from '@/modules/recipe/model/type';
import EmptyState from '@/shared/ui/EmptyState';

import RecipeDetails from '../ui/RecipeDetails';

export const PrivateRecipeGate = ({ id }: { id: string }) => {
  const { status } = useSession();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    async function run() {
      if (status === 'loading') return;

      setIsLoading(true);
      const res = await getRecipeById(id);
      if (!alive) return;

      setRecipe(res);
      setIsLoading(false);
    }

    void run();
    return () => {
      alive = false;
    };
  }, [id, status]);

  if (status === 'loading' || isLoading) {
    return (
      <div className="flex w-full justify-center py-16">
        <p className="text-sm text-gray-500">Loading recipe...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <EmptyState
          variant="generic"
          title="Recipe not found"
          description="This recipe doesn’t exist or you don’t have access."
          primaryActionLabel="Back home"
          primaryActionHref="/"
        />
      </div>
    );
  }

  return <RecipeDetails recipe={recipe} />;
};
