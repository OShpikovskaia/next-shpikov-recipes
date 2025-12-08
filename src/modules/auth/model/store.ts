import type { Session } from 'next-auth';
import { create } from 'zustand';

import { AUTH_STATUS, type SessionStatus } from '@/shared/model/auth-status';

interface AuthState {
  isAuth: boolean;
  status: SessionStatus;
  session: Session | null;
  setAuthState: (status: SessionStatus, session: Session | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuth: false,
  status: AUTH_STATUS.LOADING,
  session: null,
  setAuthState: (status: SessionStatus, session: Session | null) =>
    set({
      isAuth: status === AUTH_STATUS.AUTHENTICATED,
      status,
      session,
    }),
}));
