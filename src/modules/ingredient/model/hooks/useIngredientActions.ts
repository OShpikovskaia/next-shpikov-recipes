'use client';

import { useCallback, useMemo } from 'react';

import { createIngredient, deleteIngredient, getIngredients } from '../server-actions';
import { useIngredientStore } from '../store';
import type { IIngredient, IngredientsFormData } from '../type';

type LoadResult = { success: true; ingredients: IIngredient[] } | { success: false; error: string };
type AddResult = { success: true; ingredient: IIngredient } | { success: false; error: string };
type RemoveResult = { success: true } | { success: false; error: string };

export const useIngredientActions = () => {
  const startLoading = useIngredientStore((s) => s.startLoading);
  const setLoaded = useIngredientStore((s) => s.setLoaded);
  const setFailed = useIngredientStore((s) => s.setFailed);

  const appendIngredient = useIngredientStore((s) => s.appendIngredient);

  const addIngredient = useCallback(
    async (formData: IngredientsFormData): Promise<AddResult> => {
      try {
        const result = await createIngredient(formData);

        if (result.success) {
          appendIngredient(result.ingredient);
          return { success: true, ingredient: result.ingredient };
        }

        const message = result.error ?? 'Ingredient create error';
        setFailed(message);
        return { success: false, error: message };
      } catch {
        const message = 'Ingredient create error';
        setFailed(message);
        return { success: false, error: message };
      }
    },
    [appendIngredient, setFailed],
  );

  const loadIngredients = useCallback(async (): Promise<LoadResult> => {
    startLoading();

    try {
      const result = await getIngredients();

      if (result.success) {
        setLoaded(result.ingredients);
        return { success: true, ingredients: result.ingredients };
      }

      const message = result.error ?? 'Get ingredients error';
      setFailed(message);
      return { success: false, error: message };
    } catch {
      const message = 'Get ingredients error';
      setFailed(message);
      return { success: false, error: message };
    }
  }, [startLoading, setLoaded, setFailed]);

  const removeIngredient = useCallback(
    async (id: string): Promise<RemoveResult> => {
      const prev = useIngredientStore.getState().ingredients;

      useIngredientStore.getState()._removeIngredientLocal(id);

      try {
        const result = await deleteIngredient(id);

        if (result.success) {
          return { success: true };
        }

        // rollback
        setLoaded(prev);
        const message = result.error ?? 'Delete ingredient error';
        setFailed(message);
        return { success: false, error: message };
      } catch {
        // rollback
        setLoaded(prev);
        const message = 'Delete ingredient error';
        setFailed(message);
        return { success: false, error: message };
      }
    },
    [setLoaded, setFailed],
  );

  return useMemo(
    () => ({ loadIngredients, addIngredient, removeIngredient }),
    [loadIngredients, addIngredient, removeIngredient],
  );
};
