import { create } from 'zustand';

import { createRecipe, deleteRecipe, getrecipes, updateRecipe } from '@/actions/recipe';
import type { IRecipe } from '@/types/recipe';

interface IActionResult {
  success: boolean;
  recipe?: IRecipe;
  error?: string;
}

interface RecipeState {
  recipes: IRecipe[] | null;
  isLoading: boolean;
  error: string | null;
  loadRecipes: () => Promise<void>;
  addRecipe: (formData: FormData) => Promise<IActionResult>;
  updateRecipe: (id: string, formData: FormData) => Promise<IActionResult>;
  removeRecipe: (id: string) => Promise<void>;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: null,
  isLoading: false,
  error: null,
  loadRecipes: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await getrecipes();
      if (result.success) {
        set({ recipes: result.recipes, isLoading: false });
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.error('Get recipes error: ', error);
      set({ error: 'Get recipes error', isLoading: false, recipes: null });
    }
  },

  addRecipe: async (formData: FormData) => {
    set({ error: null });
    try {
      const result = await createRecipe(formData);

      if (result.success) {
        set((state) => ({
          recipes: [...(state.recipes || []), result.recipe!],
          isLoading: false,
        }));
        return { success: true, recipe: result.recipe };
      } else {
        set({ error: result.error, isLoading: false });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Creating recipie  error: ', error);
      set({ error: 'Creating recipie error', isLoading: false });
      return { success: false, error: 'Creating recipe error' };
    }
  },

  updateRecipe: async (id: string, formData: FormData) => {
    set({ error: null });
    try {
      const result = await updateRecipe(id, formData);

      if (result.success) {
        set((state) => ({
          recipes: (state.recipes || []).map((recipe) =>
            recipe.id === id ? result.recipe! : recipe,
          ),
          isLoading: false,
        }));
        return { success: true, recipe: result.recipe };
      } else {
        set({ error: result.error, isLoading: false });
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Updating recipie error: ', error);
      set({ error: 'Updating recipie error', isLoading: false });
      return { success: false, error: 'Updating recipe error' };
    }
  },

  removeRecipe: async (id: string) => {
    set({ error: null });
    try {
      const result = await deleteRecipe(id);
      if (result.success) {
        set((state) => ({
          recipes: (state.recipes || []).filter((recipe) => recipe.id !== id),
          isLoading: false,
        }));
      } else {
        set({ error: result.error, isLoading: false });
      }
    } catch (error) {
      console.error('Get recipes error: ', error);
      set({ error: 'Get recipes error', isLoading: false });
    }
  },
}));
