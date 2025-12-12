'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useIngredientStore } from '@/modules/ingredient/model/store';
import { useRecipeActions } from '@/modules/recipe/model/hooks/useRecipeActions';
import { useRecipeStore } from '@/modules/recipe/model/store';
import { AUTH_STATUS } from '@/shared/model/auth-status';

interface AppLoaderProps {
  children: ReactNode;
}

const AppLoader = ({ children }: AppLoaderProps) => {
  const { data: session, status } = useSession();

  const setAuthState = useAuthStore((s) => s.setAuthState);

  const resetRecipes = useRecipeStore((s) => s.reset);
  const resetIngredients = useIngredientStore((s) => s.reset);
  const loadIngredients = useIngredientStore((s) => s.loadIngredients);

  const { loadRecipes } = useRecipeActions();

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

      void loadIngredients();
      void loadRecipes();
    }
  }, [status, session?.user?.id, loadIngredients, loadRecipes, resetIngredients, resetRecipes]);

  return <>{children}</>;
};

export default AppLoader;
