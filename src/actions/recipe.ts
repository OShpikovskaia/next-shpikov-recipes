'use server';

import prisma from '@/utils/prisma';

export const getrecipes = async () => {
  try {
    const recipes = await prisma.recipe.findMany({
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

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
    const recipe = await prisma.recipe.create({
      data: {
        name,
        description,
        image: imageUrl,
        ingredients: {
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredient: { connect: { id: ingredientId } },
            quantity,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return { success: true, recipe };
  } catch (error) {
    console.error('Create recipe error: ', error);
    return { success: false, error: 'Create recipe error' };
  }
};

export const updateRecipe = async (id: string, formData: FormData) => {
  try {
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
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
    const recipe = await prisma.recipe.update({
      where: { id },
      data: {
        name,
        description,
        image: imageUrl,
        ingredients: {
          deleteMany: {},
          create: ingredients.map(({ ingredientId, quantity }) => ({
            ingredient: { connect: { id: ingredientId } },
            quantity,
          })),
        },
      },
      include: {
        ingredients: {
          include: {
            ingredient: true,
          },
        },
      },
    });

    return { success: true, recipe };
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
