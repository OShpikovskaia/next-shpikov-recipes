import { ROUTES } from './routes';

export const siteConfig = {
  title: "Shpikov's recipes",
  description: "Shpikov's healthy lifestyle recipes",
  navItems: [
    { href: ROUTES.RECIPES, label: 'Recipes' },
    { href: ROUTES.INGREDIENTS, label: 'Ingredients' },
    { href: ROUTES.ABOUT, label: 'About us' },
  ],
} as const;
