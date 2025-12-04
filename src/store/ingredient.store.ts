import { create } from 'zustand';

import { createIngredient, deleteIngredient, getIngredients } from '@/actions/ingredients';
import type { IngredientsFormData } from '@/types/form-data';
import type { IIngredient } from '@/types/ingredient';

interface ActionFeedback {
  success: boolean;
  error?: string;
}

interface IngredientState {
  ingredients: IIngredient[] | null;
  isLoading: boolean;
  error: string | null;
  loadIngredients: () => Promise<void>;
  addIngredient: (formData: IngredientsFormData) => Promise<ActionFeedback>;
  removeIngredient: (id: string) => Promise<ActionFeedback>;
}

export const useIngredientStore = create<IngredientState>((set) => ({
  ingredients: null,
  isLoading: false,
  error: null,
  loadIngredients: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await getIngredients();

      if (!result.success) {
        const message = result.error ?? 'Get ingredients error';

        set({
          ingredients: [],
          isLoading: false,
          error: message,
        });
        return;
      }

      set({
        ingredients: result.ingredients,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Get ingredients error: ', error);

      set({
        ingredients: [],
        isLoading: false,
        error: 'Get ingredients error',
      });
    }
  },
  addIngredient: async (formData: IngredientsFormData) => {
    set({ error: null });
    try {
      const result = await createIngredient(formData);

      if (result.success) {
        set((state) => ({
          ingredients: [...(state.ingredients || []), result.ingredient],
          error: null,
        }));
        return { success: true };
      }

      set({ error: result.error });
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Ingredient create error: ', error);
      const fallbackError = 'Ingredient create error';
      set({ error: fallbackError });
      return { success: false, error: fallbackError };
    }
  },
  removeIngredient: async (id: string) => {
    set({ error: null });
    try {
      const result = await deleteIngredient(id);
      if (result.success) {
        set((state) => ({
          ingredients: (state.ingredients || []).filter((ingredient) => ingredient.id !== id),
          error: null,
        }));
        return { success: true };
      }

      set({ error: result.error });
      return { success: false, error: result.error };
    } catch (error) {
      console.error('Delete ingredient error: ', error);
      const fallbackError = 'Delete ingredient error';
      set({ error: fallbackError });
      return { success: false, error: fallbackError };
    }
  },
}));
