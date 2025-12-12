'use client';

import { useCallback, useMemo } from 'react';

import { createRecipe, deleteRecipe, getRecipes, updateRecipe } from '../server-actions';
import { useRecipeStore } from '../store';
import type { IRecipe } from '../types';

interface ActionResult {
  success: boolean;
  recipe?: IRecipe;
  error?: string;
}

export const useRecipeActions = () => {
  const setLoading = useRecipeStore((state) => state.setLoading);
  const setError = useRecipeStore((state) => state.setError);
  const setRecipes = useRecipeStore((state) => state.setRecipes);
  const upsertRecipe = useRecipeStore((state) => state.upsertRecipe);
  const removeRecipeLocal = useRecipeStore((state) => state.removeRecipeLocal);

  const loadRecipes = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await getRecipes();
    if (result.success) {
      setRecipes(result.recipes);
    } else {
      setRecipes([]);
      setError(result.error ?? 'Failed to load recipes');
    }

    setLoading(false);
  }, [setLoading, setError, setRecipes]);

  const addRecipe = useCallback(
    async (formData: FormData): Promise<ActionResult> => {
      setError(null);
      const result = await createRecipe(formData);

      if (result.success && result.recipe) {
        upsertRecipe(result.recipe);
        return { success: true, recipe: result.recipe };
      }

      const message = result.error ?? 'Creating recipe error';
      setError(message);
      return { success: false, error: message };
    },
    [setError, upsertRecipe],
  );

  const editRecipe = useCallback(
    async (id: string, formData: FormData): Promise<ActionResult> => {
      setError(null);
      const result = await updateRecipe(id, formData);

      if (result.success && result.recipe) {
        upsertRecipe(result.recipe);
        return { success: true, recipe: result.recipe };
      }

      const message = result.error ?? 'Updating recipe error';
      setError(message);
      return { success: false, error: message };
    },
    [setError, upsertRecipe],
  );

  const removeRecipe = useCallback(
    async (id: string): Promise<ActionResult> => {
      setError(null);
      const result = await deleteRecipe(id);

      if (result.success) {
        removeRecipeLocal(id);
        return { success: true };
      }

      const message = result.error ?? 'Delete recipe error';
      setError(message);
      return { success: false, error: message };
    },
    [setError, removeRecipeLocal],
  );

  return useMemo(
    () => ({ loadRecipes, addRecipe, editRecipe, removeRecipe }),
    [loadRecipes, addRecipe, editRecipe, removeRecipe],
  );
};
