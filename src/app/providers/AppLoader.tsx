'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useIngredientActions } from '@/modules/ingredient/model/hooks/useIngredientActions';
import { useIngredientStore } from '@/modules/ingredient/model/store';
import { useRecipeActions } from '@/modules/recipe/model/hooks/useRecipeActions';
import { useRecipeStore } from '@/modules/recipe/model/store';
import { AUTH_STATUS } from '@/shared/model/auth-status';

interface AppLoaderProps {
  children: ReactNode;
}

const AppLoader = ({ children }: AppLoaderProps) => {
  const { data: session, status } = useSession();

  const setAuthState = useAuthStore((state) => state.setAuthState);

  const resetRecipes = useRecipeStore((state) => state.reset);
  const resetIngredients = useIngredientStore((state) => state.reset);

  const recipes = useRecipeStore((state) => state.recipes);
  const ingredients = useIngredientStore((state) => state.ingredients);

  const { loadRecipes } = useRecipeActions();
  const { loadIngredients } = useIngredientActions();

  useEffect(() => {
    setAuthState(status, session);
  }, [status, session, setAuthState]);

  useEffect(() => {
    if (status === AUTH_STATUS.LOADING) return;

    if (status === AUTH_STATUS.UNAUTHENTICATED) {
      resetRecipes();
      resetIngredients();
      return;
    }

    if (status === AUTH_STATUS.AUTHENTICATED) {
      if (!session?.user?.id) return;

      if (ingredients === null) void loadIngredients();
      if (recipes === null) void loadRecipes();
    }
  }, [
    status,
    session?.user?.id,
    ingredients,
    recipes,
    loadIngredients,
    loadRecipes,
    resetIngredients,
    resetRecipes,
  ]);

  return <>{children}</>;
};

export default AppLoader;
