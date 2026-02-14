'use client';

import { useRouter } from 'next/navigation';

import type { CreateRecipeInput } from '../server-actions';
import { createRecipe, deleteRecipe, updateRecipe } from '../server-actions';
import type { IRecipe } from '../types';

interface ActionResult {
  success: boolean;
  recipe?: IRecipe;
  error?: string;
}

export const useRecipeActions = () => {
  const router = useRouter();

  const addRecipe = async (input: CreateRecipeInput): Promise<ActionResult> => {
    const result = await createRecipe(input);

    if (result.success) {
      router.refresh();
      return { success: true, recipe: result.recipe };
    }

    return { success: false, error: result.error };
  };

  const editRecipe = async (id: string, input: any): Promise<ActionResult> => {
    const result = await updateRecipe(id, input);

    if (result.success) {
      router.refresh();
      return { success: true, recipe: result.recipe };
    }

    return { success: false, error: result.error };
  };

  const removeRecipe = async (id: string): Promise<ActionResult> => {
    const result = await deleteRecipe(id);

    if (result.success) {
      router.refresh();
      return { success: true };
    }

    return { success: false, error: result.error };
  };

  return { addRecipe, editRecipe, removeRecipe };
};
