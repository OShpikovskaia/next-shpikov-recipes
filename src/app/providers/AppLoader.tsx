'use client';

import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

import { useAuthStore } from '@/modules/auth/model/store';
import { useIngredientActions } from '@/modules/ingredient/model/hooks/useIngredientActions';
import { useIngredientStore } from '@/modules/ingredient/model/store';
import { AUTH_STATUS } from '@/shared/model/auth-status';

interface AppLoaderProps {
  children: ReactNode;
}

const AppLoader = ({ children }: AppLoaderProps) => {
  const { data: session, status } = useSession();

  const setAuthState = useAuthStore((s) => s.setAuthState);

  const resetIngredients = useIngredientStore((s) => s.reset);
  const ingredientStatus = useIngredientStore((s) => s.status); // 'idle' | 'loading' | 'success' | 'error'

  const { loadIngredients } = useIngredientActions();

  useEffect(() => {
    setAuthState(status, session);
  }, [status, session, setAuthState]);

  useEffect(() => {
    if (status === AUTH_STATUS.LOADING) return;

    if (status === AUTH_STATUS.UNAUTHENTICATED) {
      resetIngredients();
      return;
    }

    if (status === AUTH_STATUS.AUTHENTICATED) {
      const userId = session?.user?.id;
      if (!userId) return;

      if (ingredientStatus === 'idle') {
        void loadIngredients();
      }
    }
  }, [status, session?.user?.id, ingredientStatus, loadIngredients, resetIngredients]);

  return <>{children}</>;
};

export default AppLoader;
