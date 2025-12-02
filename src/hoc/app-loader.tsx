'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { useAuthStore } from '@/store/auth.store';
import { useIngredientStore } from '@/store/ingredient.store';
import { useRecipeStore } from '@/store/recipe.store';

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
