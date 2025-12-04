import { create } from 'zustand';

import { createRecipe, deleteRecipe, getrecipes, updateRecipe } from '@/actions/recipe';
import type { IRecipe } from '@/types/recipe';

interface ActionResult {
  success: boolean;
  recipe?: IRecipe;
  error?: string;
}

interface RecipeState {
  recipes: IRecipe[] | null;
  isLoading: boolean;
  error: string | null;
  loadRecipes: () => Promise<void>;
  addRecipe: (formData: FormData) => Promise<ActionResult>;
  updateRecipe: (id: string, formData: FormData) => Promise<ActionResult>;
  removeRecipe: (id: string) => Promise<ActionResult>;
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
        set({
          recipes: result.recipes,
          isLoading: false,
          error: null,
        });
      } else {
        const message = result.error ?? 'Failed to load recipes';
        set({
          recipes: [],
          isLoading: false,
          error: message,
        });
      }
    } catch (error) {
      console.error('Get recipes error: ', error);
      const message = 'Get recipes error';
      set({
        recipes: [],
        isLoading: false,
        error: message,
      });
    }
  },

  addRecipe: async (formData: FormData): Promise<ActionResult> => {
    set({ error: null });

    try {
      const result = await createRecipe(formData);

      if (result.success && result.recipe) {
        set((state) => ({
          recipes: [...(state.recipes ?? []), result.recipe!],
        }));

        return { success: true, recipe: result.recipe };
      }

      const message = result.error ?? 'Creating recipe error';
      set({ error: message });
      return { success: false, error: message };
    } catch (error) {
      console.error('Creating recipe error: ', error);
      const message = 'Creating recipe error';
      set({ error: message });
      return { success: false, error: message };
    }
  },

  updateRecipe: async (id: string, formData: FormData): Promise<ActionResult> => {
    set({ error: null });

    try {
      const result = await updateRecipe(id, formData);

      if (result.success && result.recipe) {
        set((state) => ({
          recipes: (state.recipes ?? []).map((recipe) =>
            recipe.id === id ? result.recipe! : recipe,
          ),
        }));

        return { success: true, recipe: result.recipe };
      }

      const message = result.error ?? 'Updating recipe error';
      set({ error: message });
      return { success: false, error: message };
    } catch (error) {
      console.error('Updating recipe error: ', error);
      const message = 'Updating recipe error';
      set({ error: message });
      return { success: false, error: message };
    }
  },

  removeRecipe: async (id: string): Promise<ActionResult> => {
    set({ error: null });

    try {
      const result = await deleteRecipe(id);

      if (result.success) {
        set((state) => ({
          recipes: (state.recipes ?? []).filter((recipe) => recipe.id !== id),
        }));

        return { success: true };
      }

      const message = result.error ?? 'Delete recipe error';
      set({ error: message });
      return { success: false, error: message };
    } catch (error) {
      console.error('Delete recipe error: ', error);
      const message = 'Delete recipe error';
      set({ error: message });
      return { success: false, error: message };
    }
  },
}));
