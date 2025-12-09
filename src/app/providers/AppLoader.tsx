'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useIngredientStore } from '@/modules/ingredient/model/store';
import { useRecipeStore } from '@/modules/recipe/model/store';

import { AUTH_STATUS } from '../../shared/model/auth-status';

interface AppLoaderProps {
  children: ReactNode;
}

const AppLoader = ({ children }: AppLoaderProps) => {
  const { data: session, status } = useSession();

  const { setAuthState } = useAuthStore();
  const { loadIngredients } = useIngredientStore();
  const { loadRecipes, reset: resetRecipes } = useRecipeStore();
  const { reset: resetIngredients } = useIngredientStore();

  useEffect(() => {
    setAuthState(status, session);
  }, [session, status, setAuthState]);

  useEffect(() => {
    if (status !== AUTH_STATUS.AUTHENTICATED) {
      return;
    }

    loadIngredients();
  }, [status, session?.user?.id, loadIngredients]);

  useEffect(() => {
    if (status === AUTH_STATUS.LOADING) return;

    resetRecipes();
    resetIngredients();
    loadRecipes();
  }, [status, session?.user?.id, resetRecipes, loadRecipes, resetIngredients]);

  return <>{children}</>;
};

export default AppLoader;
