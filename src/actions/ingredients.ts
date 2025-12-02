'use server';

import type { Ingredients } from '@/generated/prisma/client';
import { ingredientSchema } from '@/schema/zod';
import type { IngredientsFormData } from '@/types/form-data';
import prisma from '@/utils/prisma';

type CreateIngredientResult =
  | { success: true; ingredient: Ingredients }
  | { success: false; error: string };

const normalizePricePerUnit = (price: IngredientsFormData['pricePerUnit']) => {
  const trimmedPrice = price?.trim();

  if (!trimmedPrice) {
    return null;
  }

  const parsedPrice = Number.parseFloat(trimmedPrice);
  return Number.isNaN(parsedPrice) ? Number.NaN : parsedPrice;
};

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
      const message = parsedResult.error.issues.map((issue) => issue.message).join(', ');
      return { success: false, error: message };
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

export const getIngredients = async () => {
  try {
    const ingredients = await prisma.ingredients.findMany();
    return { success: true, ingredients };
  } catch (error) {
    console.error('Get ingredients error: ', error);
    return { error: 'Get ingredients error' };
  }
};

export const deleteIngredient = async (id: string) => {
  try {
    const ingredient = await prisma.ingredients.delete({
      where: { id },
    });

    return { success: true, ingredient };
  } catch (error) {
    console.error('Delete ingredient error: ', error);
    return { error: 'Delete ingredient error' };
  }
};
