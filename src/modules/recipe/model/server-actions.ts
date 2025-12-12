'use server';

import { auth } from '@/modules/auth/model/auth';
import type { IRecipe } from '@/modules/recipe/model/types';
import prisma from '@/shared/lib/prisma';

import { mapDbRecipeToRecipe, RECIPE_INCLUDE } from './db';
import { parseValidQuantity } from './utils/server';

type IngredientInput = {
  ingredientId: string;
  quantity: number;
};

type ParsedRecipeForm = {
  name: string;
  description: string;
  steps: string;
  imageUrl: string | null;
  isPublic: boolean;
  ingredients: IngredientInput[];
};

const parseRecipeForm = (formData: FormData): ParsedRecipeForm => {
  const name = (formData.get('name') as string | null)?.trim() ?? '';
  const description = (formData.get('description') as string | null)?.trim() ?? '';
  const steps = (formData.get('steps') as string | null)?.trim() ?? '';
  const rawImage = (formData.get('imageUrl') as string | null)?.trim() ?? '';
  const imageUrl = rawImage.length ? rawImage : null;

  const isPublic = formData.get('isPublic') != null;

  const ingredients: IngredientInput[] = Array.from(formData.entries())
    .filter(([key]) => key.startsWith('ingredient_'))
    .map(([key, value]) => {
      const index = key.split('_')[1]!;
      const quantity = parseFloat(formData.get(`quantity_${index}`) as string);

      return {
        ingredientId: value as string,
        quantity,
      };
    });

  if (!name || !ingredients.length) {
    throw new Error('Name and at least one ingredient are required.');
  }

  return {
    name,
    description,
    steps,
    imageUrl,
    isPublic,
    ingredients,
  };
};

const getCurrentUserId = async (): Promise<string | null> => {
  const session = await auth();
  return session?.user?.id ?? null;
};

const assertCanModifyRecipe = async (recipeId: string, userId: string) => {
  const recipe = await prisma.recipe.findUnique({
    where: { id: recipeId },
    select: { authorId: true },
  });

  if (!recipe) {
    throw new Error('Recipe not found');
  }

  if (!recipe.authorId || recipe.authorId !== userId) {
    throw new Error('You cannot modify this recipe');
  }
};

type GetRecipesResult = { success: true; recipes: IRecipe[] } | { success: false; error: string };

export const getRecipes = async (): Promise<GetRecipesResult> => {
  try {
    const userId = await getCurrentUserId();

    const where = userId
      ? {
          OR: [{ isPublic: true }, { authorId: userId }],
        }
      : {
          isPublic: true,
        };

    const dbRecipes = await prisma.recipe.findMany({
      where,
      include: RECIPE_INCLUDE,
      orderBy: { updatedAt: 'desc' },
    });

    const recipes = dbRecipes.map(mapDbRecipeToRecipe);

    return { success: true, recipes };
  } catch {
    return { success: false, error: 'Get recipes error' };
  }
};

export const createRecipe = async (formData: FormData) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    const { name, description, steps, imageUrl, isPublic, ingredients } = parseRecipeForm(formData);

    const dbRecipe = await prisma.recipe.create({
      data: {
        name,
        description,
        steps,
        image: imageUrl,
        isPublic,
        authorId: userId,
        ingredients: {
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredient: { connect: { id: ingredientId } },
            quantity: parseValidQuantity(quantity),
          })),
        },
      },
      include: RECIPE_INCLUDE,
    });

    return { success: true, recipe: mapDbRecipeToRecipe(dbRecipe) };
  } catch (error) {
    const message =
      error instanceof Error && error.message.startsWith('Quantity')
        ? error.message
        : 'Create recipe error';

    return { success: false, error: message };
  }
};

export const updateRecipe = async (id: string, formData: FormData) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await assertCanModifyRecipe(id, userId);

    const { name, description, steps, imageUrl, isPublic, ingredients } = parseRecipeForm(formData);

    const dbRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        name,
        description,
        steps,
        image: imageUrl,
        isPublic,
        ingredients: {
          deleteMany: {},
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredient: { connect: { id: ingredientId } },
            quantity: parseValidQuantity(quantity),
          })),
        },
      },
      include: RECIPE_INCLUDE,
    });

    return { success: true, recipe: mapDbRecipeToRecipe(dbRecipe) };
  } catch (error) {
    const message =
      error instanceof Error && error.message.startsWith('Quantity')
        ? error.message
        : 'Updating recipes error';
    return { success: false, error: message };
  }
};

export const deleteRecipe = async (id: string) => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await assertCanModifyRecipe(id, userId);

    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: id },
    });

    await prisma.recipe.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Deleting recipes error';
    return { success: false, error: message };
  }
};

export const getRecipeById = async (id: string) => {
  if (!id) return null;

  try {
    const userId = await getCurrentUserId();

    const dbRecipe = await prisma.recipe.findUnique({
      where: { id },
      include: RECIPE_INCLUDE,
    });

    if (!dbRecipe) return null;

    if (!dbRecipe.isPublic && dbRecipe.authorId && dbRecipe.authorId !== userId) {
      return null;
    }

    return mapDbRecipeToRecipe(dbRecipe);
  } catch {
    return null;
  }
};

export const getRecipeByIdForOwner = async (id: string) => {
  if (!id) return null;

  try {
    const userId = await getCurrentUserId();
    if (!userId) return null;

    const dbRecipe = await prisma.recipe.findUnique({
      where: { id },
      include: RECIPE_INCLUDE,
    });

    if (!dbRecipe || !dbRecipe.authorId || dbRecipe.authorId !== userId) {
      return null;
    }

    return mapDbRecipeToRecipe(dbRecipe);
  } catch {
    return null;
  }
};
