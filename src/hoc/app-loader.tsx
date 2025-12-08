'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useIngredientStore } from '@/modules/ingredient/model/store';
import { useRecipeStore } from '@/modules/recipe/model/store';

interface AppLoaderProps {
  children: ReactNode;
}

const AppLoader = ({ children }: AppLoaderProps) => {
  const { data: session, status } = useSession();

  const { setAuthState } = useAuthStore();
  const { loadIngredients } = useIngredientStore();
  const { loadRecipes, reset: resetRecipes } = useRecipeStore();

  useEffect(() => {
    setAuthState(status, session);
  }, [session, status, setAuthState]);

  useEffect(() => {
    if (status !== 'authenticated') {
      return;
    }

    loadIngredients();
  }, [status, session?.user?.id, loadIngredients]);

  useEffect(() => {
    if (status === 'loading') return;

    resetRecipes();

    loadRecipes();
  }, [status, session?.user?.id, resetRecipes, loadRecipes]);

  return <>{children}</>;
};

export default AppLoader;
