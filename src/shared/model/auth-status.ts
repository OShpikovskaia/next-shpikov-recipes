export const AUTH_STATUS = {
  LOADING: 'loading',
  AUTHENTICATED: 'authenticated',
  UNAUTHENTICATED: 'unauthenticated',
} as const;

export type SessionStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS];
