import 'server-only';

import type { IRecipe } from '@/modules/recipe/model/type';
import prisma from '@/shared/lib/prisma';

import { mapDbRecipeToRecipe, RECIPE_INCLUDE } from './db';

export const getPublicRecipes = async (): Promise<IRecipe[]> => {
  const dbRecipes = await prisma.recipe.findMany({
    where: { isPublic: true },
    include: RECIPE_INCLUDE,
    orderBy: { updatedAt: 'desc' },
  });

  return dbRecipes.map(mapDbRecipeToRecipe);
};

export const getPublicRecipeById = async (id: string): Promise<IRecipe | null> => {
  if (!id) return null;

  const dbRecipe = await prisma.recipe.findFirst({
    where: { id, isPublic: true },
    include: RECIPE_INCLUDE,
  });

  return dbRecipe ? mapDbRecipeToRecipe(dbRecipe) : null;
};

export const getPublicRecipeIdsForBuild = async (limit = 20): Promise<string[]> => {
  const rows = await prisma.recipe.findMany({
    where: { isPublic: true },
    select: { id: true },
    take: limit,
    orderBy: { updatedAt: 'desc' },
  });

  return rows.map((r) => r.id);
};

export const getRecipeByIdForOwner = async (id: string): Promise<IRecipe | null> => {
  if (!id) return null;

  const dbRecipe = await prisma.recipe.findFirst({
    where: { id },
    include: RECIPE_INCLUDE,
  });

  return dbRecipe ? mapDbRecipeToRecipe(dbRecipe) : null;
};
