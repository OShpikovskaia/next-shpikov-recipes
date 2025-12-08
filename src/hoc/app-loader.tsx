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
  const { loadIngredients } = useIngredientStore();
  const { loadRecipes } = useRecipeStore();
  const { isAuth, setAuthState } = useAuthStore();

  useEffect(() => {
    setAuthState(status, session);
  }, [session, status, setAuthState]);

  useEffect(() => {
    if (!isAuth) return;
    loadIngredients();
  }, [isAuth, loadIngredients]);

  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return <>{children}</>;
};

export default AppLoader;
