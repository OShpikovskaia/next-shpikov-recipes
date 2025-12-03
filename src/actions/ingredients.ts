'use server';

import type { Ingredients } from '@prisma/client';

import { ingredientSchema } from '@/schema/zod';
import type { IngredientsFormData } from '@/types/form-data';
import prisma from '@/utils/prisma';

type IngredientErrorResult = { success: false; error: string };
type CreateIngredientResult = { success: true; ingredient: Ingredients } | IngredientErrorResult;
type GetIngredientsResult = { success: true; ingredients: Ingredients[] } | IngredientErrorResult;
type DeleteIngredientResult = { success: true; ingredient: Ingredients } | IngredientErrorResult;

const normalizePricePerUnit = (price: IngredientsFormData['pricePerUnit']) => {
  const trimmedPrice = price?.trim();

  if (!trimmedPrice) {
    return null;
  }

  const parsedPrice = Number.parseFloat(trimmedPrice);
  return Number.isNaN(parsedPrice) ? Number.NaN : parsedPrice;
};

const formatZodError = (issues: { message: string }[]) =>
  issues.map((issue) => issue.message).join(', ');

export const createIngredient = async (
  formData: IngredientsFormData,
): Promise<CreateIngredientResult> => {
  try {
    const normalizedInput = {
      ...formData,
      pricePerUnit: normalizePricePerUnit(formData.pricePerUnit),
    };

    const parsedResult = ingredientSchema.safeParse(normalizedInput);

    if (!parsedResult.success) {
      return { success: false, error: formatZodError(parsedResult.error.issues) };
    }

    const ingredient = await prisma.ingredients.create({
      data: parsedResult.data,
    });

    return { success: true, ingredient };
  } catch (error) {
    console.error('Ingredient create error:', error);
    return { success: false, error: 'Ingredient create error' };
  }
};

export const getIngredients = async (): Promise<GetIngredientsResult> => {
  try {
    const ingredients = await prisma.ingredients.findMany();
    return { success: true, ingredients };
  } catch (error) {
    console.error('Get ingredients error: ', error);
    return { success: false, error: 'Get ingredients error' };
  }
};

export const deleteIngredient = async (id: string): Promise<DeleteIngredientResult> => {
  try {
    const ingredient = await prisma.ingredients.delete({
      where: { id },
    });

    return { success: true, ingredient };
  } catch (error) {
    console.error('Delete ingredient error: ', error);
    return { success: false, error: 'Delete ingredient error' };
  }
};
