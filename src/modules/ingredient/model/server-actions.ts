'use server';

import type { Ingredients } from '@prisma/client';

import { auth } from '@/modules/auth/model/auth';
import prisma from '@/shared/lib/prisma';
import type { IngredientsFormData } from '@/shared/types/form-data';

import { ingredientSchema } from './schema';

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
    const session = await auth();
    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }

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
  } catch {
    return { success: false, error: 'Ingredient create error' };
  }
};

export const getIngredients = async (): Promise<GetIngredientsResult> => {
  try {
    const session = await auth();

    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }
    const ingredients = await prisma.ingredients.findMany();
    return { success: true, ingredients };
  } catch {
    return { success: false, error: 'Get ingredients error' };
  }
};

export const deleteIngredient = async (id: string): Promise<DeleteIngredientResult> => {
  try {
    const session = await auth();

    if (!session) {
      return { success: false, error: 'Unauthorized' };
    }
    const ingredient = await prisma.ingredients.delete({
      where: { id },
    });

    return { success: true, ingredient };
  } catch {
    return { success: false, error: 'Delete ingredient error' };
  }
};
