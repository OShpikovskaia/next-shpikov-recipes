import type { Prisma } from '@prisma/client';

import type { IRecipe } from './type';

export const RECIPE_INCLUDE = {
  ingredients: {
    include: {
      ingredient: true,
    },
  },
} satisfies Prisma.RecipeInclude;

type DbRecipeWithIngredients = Prisma.RecipeGetPayload<{
  include: typeof RECIPE_INCLUDE;
}>;

export const mapDbRecipeToRecipe = (db: DbRecipeWithIngredients): IRecipe => {
  return {
    id: db.id,
    name: db.name,
    description: db.description,
    steps: db.steps || '',
    imageUrl: db.image ?? null,
    isPublic: db.isPublic,
    authorId: db.authorId ?? null,
    ingredients: db.ingredients,
  };
};
