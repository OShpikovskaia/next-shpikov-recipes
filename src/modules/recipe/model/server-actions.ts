'use server';

import type { Ingredients, Recipe as PrismaRecipe, RecipeIngredient } from '@prisma/client';

import { auth } from '@/modules/auth/model/auth';
import type { IRecipe } from '@/modules/recipe/model/type';
import prisma from '@/shared/lib/prisma';

type DbRecipeWithIngredients = PrismaRecipe & {
  ingredients: (RecipeIngredient & { ingredient: Ingredients })[];
};

const mapDbRecipeToRecipe = (db: DbRecipeWithIngredients): IRecipe => {
  return {
    id: db.id,
    name: db.name,
    description: db.description,
    steps: db.steps || '',
    imageUrl: db.image ?? null,
    ingredients: db.ingredients,
  };
};

const DEFAULT_RECIPE_INCLUDE_INGREDIENTS = {
  ingredients: {
    include: {
      ingredient: true,
    },
  },
};

export const getRecipes = async () => {
  try {
    const dbRecipes = await prisma.recipe.findMany({
      include: DEFAULT_RECIPE_INCLUDE_INGREDIENTS,
    });

    const recipes = dbRecipes.map(mapDbRecipeToRecipe);

    return { success: true, recipes };
  } catch {
    return { success: false, error: 'Get recipes error' };
  }
};

export const createRecipe = async (formData: FormData) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const steps = formData.get('steps') as string;
    const imageUrl = formData.get('imageUrl') as string;

    const ingredients = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('ingredient_'))
      .map(([key, value]) => {
        const index = key.split('_')[1];
        const quantity = parseFloat(formData.get(`quantity_${index}`) as string);

        return {
          ingredientId: value as string,
          quantity,
        };
      });

    if (!name || !ingredients.length) {
      return {
        success: false,
        error: 'Name and at least one ingredient are required.',
      };
    }

    const dbRecipe = await prisma.recipe.create({
      data: {
        name,
        description,
        steps,
        image: imageUrl,
        ingredients: {
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredient: { connect: { id: ingredientId } },
            quantity,
          })),
        },
      },
      include: DEFAULT_RECIPE_INCLUDE_INGREDIENTS,
    });

    return { success: true, recipe: mapDbRecipeToRecipe(dbRecipe) };
  } catch {
    return { success: false, error: 'Create recipe error' };
  }
};

export const updateRecipe = async (id: string, formData: FormData) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const steps = formData.get('steps') as string;
    const imageUrl = formData.get('imageUrl') as string;

    const ingredients = Array.from(formData.entries())
      .filter(([key]) => key.startsWith('ingredient_'))
      .map(([key, value]) => {
        const index = key.split('_')[1];
        const quantity = parseFloat(formData.get(`quantity_${index}`) as string);

        return {
          ingredientId: value as string,
          quantity,
        };
      });

    if (!name || !ingredients.length) {
      return {
        success: false,
        error: 'Name and at least one ingredient are required.',
      };
    }

    const dbRecipe = await prisma.recipe.update({
      where: { id },
      data: {
        name,
        description,
        steps,
        image: imageUrl,
        ingredients: {
          deleteMany: {},
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredient: { connect: { id: ingredientId } },
            quantity,
          })),
        },
      },
      include: DEFAULT_RECIPE_INCLUDE_INGREDIENTS,
    });

    return { success: true, recipe: mapDbRecipeToRecipe(dbRecipe) };
  } catch {
    return { success: false, error: 'Updating recipes error' };
  }
};

export const deleteRecipe = async (id: string) => {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: 'Unauthorized' };
    }

    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: id },
    });

    await prisma.recipe.delete({
      where: { id },
    });

    return { success: true };
  } catch {
    return { success: false, error: 'Deleting recipes error' };
  }
};

export const getRecipeById = async (id: string) => {
  if (!id) return null;

  try {
    const dbRecipe = await prisma.recipe.findUnique({
      where: { id },
      include: DEFAULT_RECIPE_INCLUDE_INGREDIENTS,
    });

    return dbRecipe ? mapDbRecipeToRecipe(dbRecipe) : null;
  } catch {
    return null;
  }
};
