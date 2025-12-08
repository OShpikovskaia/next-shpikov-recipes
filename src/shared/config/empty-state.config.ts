export type EmptyStateVariant =
  | 'recipeNotFound'
  | 'noRecipes'
  | 'noIngredients'
  | 'unauthorized'
  | 'generic'
  | 'recipeImageMissing';

export const EMPTY_STATE_CONFIG: Record<
  EmptyStateVariant,
  {
    imageSrc: string;
    alt: string;
    defaultTitle?: string;
    defaultDescription?: string;
  }
> = {
  recipeNotFound: {
    imageSrc: '/empty-states/recipe-not-found.svg',
    alt: 'Recipe not found',
    defaultTitle: 'Recipe not found',
    defaultDescription: 'Maybe it was deleted or the link is outdated.',
  },
  noRecipes: {
    imageSrc: '/empty-states/no-recipes-yet.svg',
    alt: 'No recipes yet',
    defaultTitle: "You don't have any recipes yet",
    defaultDescription: 'Create your first recipe to start your healthy collection.',
  },
  noIngredients: {
    imageSrc: '/empty-states/no-ingredients.svg',
    alt: 'No ingredients',
    defaultTitle: 'No ingredients found',
    defaultDescription: 'Add some ingredients first to build your recipes.',
  },
  unauthorized: {
    imageSrc: '/empty-states/unauthorized.svg',
    alt: 'Authorization required',
    defaultTitle: 'Insufficient rights',
    defaultDescription: 'Please sign in to access this page.',
  },
  generic: {
    imageSrc: '/empty-states/generic-empty.svg',
    alt: 'Nothing here',
    defaultTitle: 'Nothing here yet',
    defaultDescription: 'There is nothing to show here right now.',
  },
  recipeImageMissing: {
    imageSrc: '/empty-states/recipe-image-placeholder.svg',
    alt: 'Recipe image placeholder',
  },
};
