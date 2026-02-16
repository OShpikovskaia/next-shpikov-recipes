export const ROUTES = {
  RECIPES: '/',
  INGREDIENTS: '/ingredients',
  ABOUT: '/about',
} as const;

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];
