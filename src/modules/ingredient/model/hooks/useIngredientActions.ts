'use client';

import { useCallback, useMemo } from 'react';

import { createIngredient, deleteIngredient, getIngredients } from '../server-actions';
import { useIngredientStore } from '../store';
import type { IIngredient, IngredientsFormData } from '../type';

type LoadResult = { success: true; ingredients: IIngredient[] } | { success: false; error: string };
type AddResult = { success: true; ingredient: IIngredient } | { success: false; error: string };
type RemoveResult = { success: true } | { success: false; error: string };

export const useIngredientActions = () => {
  const setLoading = useIngredientStore((state) => state.setLoading);
  const setError = useIngredientStore((state) => state.setError);
  const setIngredients = useIngredientStore((state) => state.setIngredients);
  const appendIngredient = useIngredientStore((state) => state.appendIngredient);

  const addIngredient = useCallback(
    async (formData: IngredientsFormData): Promise<AddResult> => {
      setError(null);

      try {
        const result = await createIngredient(formData);

        if (result.success) {
          appendIngredient(result.ingredient);
          return { success: true, ingredient: result.ingredient };
        }

        const message = result.error ?? 'Ingredient create error';
        setError(message);
        return { success: false, error: message };
      } catch {
        const message = 'Ingredient create error';
        setError(message);
        return { success: false, error: message };
      }
    },
    [setError, appendIngredient],
  );

  const loadIngredients = useCallback(async (): Promise<LoadResult> => {
    setLoading(true);
    setError(null);

    try {
      const result = await getIngredients();

      if (result.success) {
        setIngredients(result.ingredients);
        return { success: true, ingredients: result.ingredients };
      }

      const message = result.error ?? 'Get ingredients error';
      setIngredients([]);
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setIngredients]);

  const removeIngredient = useCallback(
    async (id: string): Promise<RemoveResult> => {
      setError(null);

      const prev = useIngredientStore.getState().ingredients;
      useIngredientStore.getState()._removeIngredientLocal(id);

      try {
        const result = await deleteIngredient(id);

        if (result.success) return { success: true };

        if (prev) setIngredients(prev);
        const message = result.error ?? 'Delete ingredient error';
        setError(message);
        return { success: false, error: message };
      } catch {
        if (prev) setIngredients(prev);
        const message = 'Delete ingredient error';
        setError(message);
        return { success: false, error: message };
      }
    },
    [setError, setIngredients],
  );

  return useMemo(
    () => ({ loadIngredients, addIngredient, removeIngredient }),
    [loadIngredients, addIngredient, removeIngredient],
  );
};
