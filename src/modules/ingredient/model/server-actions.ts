'use server';

import { type Ingredient, Prisma } from '@prisma/client';

import { auth } from '@/modules/auth/model/auth';
import prisma from '@/shared/lib/prisma';

import { ingredientSchema } from './schema';
import type { IngredientsFormData } from './type';

type IngredientErrorResult = { success: false; error: string };
type CreateIngredientResult = { success: true; ingredient: Ingredient } | IngredientErrorResult;
type GetIngredientsResult = { success: true; ingredients: Ingredient[] } | IngredientErrorResult;
type DeleteIngredientResult = { success: true; ingredient?: Ingredient } | IngredientErrorResult;

const normalizeName = (name: string) => name.trim().replace(/\s+/g, ' ').toLowerCase();

const normalizePricePerUnit = (price: IngredientsFormData['pricePerUnit']) => {
  const trimmedPrice = price?.trim();
  if (!trimmedPrice) return null;

  const parsedPrice = Number.parseFloat(trimmedPrice);
  return Number.isNaN(parsedPrice) ? Number.NaN : parsedPrice;
};

const formatZodError = (issues: { message: string }[]) =>
  issues.map((issue) => issue.message).join(', ');

const getCurrentUserId = async (): Promise<string | null> => {
  const session = await auth();
  return session?.user?.id ?? null;
};

export const createIngredient = async (
  formData: IngredientsFormData,
): Promise<CreateIngredientResult> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: 'Unauthorized' };
    const normalizedName = normalizeName(formData.name);

    const normalizedInput = {
      ...formData,
      name: formData.name.trim(),
      pricePerUnit: normalizePricePerUnit(formData.pricePerUnit),
      normalizedName,
    };

    const parsedResult = ingredientSchema.safeParse(normalizedInput);
    if (!parsedResult.success) {
      return { success: false, error: formatZodError(parsedResult.error.issues) };
    }

    const ingredient = await prisma.ingredient.create({
      data: { ...parsedResult.data, authorId: userId, normalizedName },
    });

    return { success: true, ingredient };
  } catch (e) {
    console.error('createIngredient error:', e);
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
      return { success: false, error: 'Ingredient already exists' };
    }
    return { success: false, error: 'Ingredient create error' };
  }
};

export const getIngredients = async (): Promise<GetIngredientsResult> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const ingredients = await prisma.ingredient.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    return { success: true, ingredients };
  } catch {
    return { success: false, error: 'Get ingredients error' };
  }
};
export const deleteIngredient = async (id: string): Promise<DeleteIngredientResult> => {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return { success: false, error: 'Unauthorized' };

    const { count } = await prisma.ingredient.deleteMany({
      where: { id, authorId: userId },
    });

    if (count === 0) {
      return { success: false, error: 'Not found or forbidden' };
    }

    return { success: true };
  } catch {
    return { success: false, error: 'Delete ingredient error' };
  }
};
