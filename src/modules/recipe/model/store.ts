import { create } from 'zustand';

import type { IRecipe } from '@/modules/recipe/model/types';

interface RecipeState {
  recipes: IRecipe[] | null;
  isLoading: boolean;
  error: string | null;

  reset: () => void;

  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setRecipes: (value: IRecipe[]) => void;
  upsertRecipe: (value: IRecipe) => void;
  removeRecipeLocal: (id: string) => void;
}

export const useRecipeStore = create<RecipeState>((set) => ({
  recipes: null,
  isLoading: false,
  error: null,

  reset: () => set({ recipes: null, isLoading: false, error: null }),

  setLoading: (value) => set({ isLoading: value }),
  setError: (value) => set({ error: value }),
  setRecipes: (value) => set({ recipes: value }),
  upsertRecipe: (value) =>
    set((state) => ({
      recipes: state.recipes
        ? state.recipes.some((r) => r.id === value.id)
          ? state.recipes.map((r) => (r.id === value.id ? value : r))
          : [...state.recipes, value]
        : [value],
    })),
  removeRecipeLocal: (id) =>
    set((state) => ({
      recipes: (state.recipes ?? []).filter((r) => r.id !== id),
    })),
}));
