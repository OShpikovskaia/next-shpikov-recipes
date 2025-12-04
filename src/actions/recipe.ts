'use server';

import type { Ingredients, Recipe as PrismaRecipe, RecipeIngredient } from '@prisma/client';

import type { IRecipe } from '@/types/recipe';
import prisma from '@/utils/prisma';

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
  } catch (error) {
    console.error('Get recipes error: ', error);
    return { success: false, error: 'Get recipes error' };
  }
};

export const createRecipe = async (formData: FormData) => {
  try {
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
  } catch (error) {
    console.error('Create recipe error: ', error);
    return { success: false, error: 'Create recipe error' };
  }
};

export const updateRecipe = async (id: string, formData: FormData) => {
  try {
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
  } catch (error) {
    console.error('Updating recipes error: ', error);
    return { success: false, error: 'Updating recipes error' };
  }
};

export const deleteRecipe = async (id: string) => {
  try {
    await prisma.recipeIngredient.deleteMany({
      where: { recipeId: id },
    });

    await prisma.recipe.delete({
      where: { id },
    });

    return { success: true };
  } catch (error) {
    console.error('Deleting recipes error: ', error);
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
  } catch (error) {
    console.error('getRecipeById error', error);
    return null;
  }
};
