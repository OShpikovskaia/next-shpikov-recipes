import { create } from 'zustand';

import {
  createRecipe,
  deleteRecipe,
  getRecipes,
  updateRecipe,
} from '@/modules/recipe/model/server-actions';
import type { IRecipe } from '@/modules/recipe/model/type';

interface ActionResult {
  success: boolean;
  recipe?: IRecipe;
  error?: string;
}

interface RecipeState {
  recipes: IRecipe[] | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
  loadRecipes: () => Promise<void>;
  addRecipe: (formData: FormData) => Promise<ActionResult>;
  updateRecipe: (id: string, formData: FormData) => Promise<ActionResult>;
  removeRecipe: (id: string) => Promise<ActionResult>;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: null,
  isLoading: false,
  error: null,
  reset: () =>
    set({
      recipes: null,
      isLoading: false,
      error: null,
    }),

  loadRecipes: async () => {
    set({ isLoading: true, error: null, recipes: null });

    try {
      const result = await getRecipes();

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
    } catch {
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
      set({ error: message, isLoading: false });
      return { success: false, error: message };
    } catch {
      set({ error: 'Creating recipe error', isLoading: false });
      return { success: false, error: 'Creating recipe error' };
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
    } catch {
      set({ error: 'Updating recipe error', isLoading: false });
      return { success: false, error: 'Updating recipe error' };
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
    } catch {
      set({ error: 'Delete recipe error', isLoading: false });
      return { success: false, error: 'Delete recipe error' };
    }
  },
}));
