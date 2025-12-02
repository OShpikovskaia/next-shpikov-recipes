import { create } from 'zustand';

import { createIngredient, deleteIngredient, getIngredients } from '@/actions/ingredients';
import type { IngredientsFormData } from '@/types/form-data';
import type { IIngredient } from '@/types/ingredient';

interface IngredientState {
  ingredients: IIngredient[];
  isLoading: boolean;
  error: string | null;
  loadIngredients: () => Promise<void>;
  addIngredient: (formData: IngredientsFormData) => Promise<void>;
  removeIngredient: (id: string) => Promise<void>;
}

export const useIngredientStore = create<IngredientState>((set) => ({
  ingredients: [],
  isLoading: false,
  error: null,
  loadIngredients: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getIngredients();
      if (result.success) {
        set({ ingredients: result.ingredients, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.error('Get ingredients error: ', error);
      set({ error: 'Get ingredients error', isLoading: false });
    }
  },
  addIngredient: async (formData: IngredientsFormData) => {
    set({ error: null });
    try {
      const result = await createIngredient(formData);

      if (result.success) {
        set((state) => ({
          ingredients: [...state.ingredients, result.ingredient],
          isLoading: false,
        }));
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.error('Ingredient create error: ', error);
      set({ error: 'Ingredient create error', isLoading: false });
    }
  },
  removeIngredient: async (id: string) => {
    set({ error: null });
    try {
      const result = await deleteIngredient(id);
      if (result.success) {
        set((state) => ({
          ingredients: state.ingredients.filter((ingredient) => ingredient.id !== id),
          isLoading: false,
        }));
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.error('Delete ingredient error: ', error);
      set({ error: 'Delete ingredient error', isLoading: false });
    }
  },
}));
