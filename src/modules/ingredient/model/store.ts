import { create } from 'zustand';

import type { IIngredient } from './type';

interface IngredientState {
  ingredients: IIngredient[] | null;
  isLoading: boolean;
  error: string | null;

  reset: () => void;

  setLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setIngredients: (value: IIngredient[]) => void;
  appendIngredient: (value: IIngredient) => void;
  removeIngredientLocal: (id: string) => void;
}

export const useIngredientStore = create<IngredientState>((set) => ({
  ingredients: null,
  isLoading: false,
  error: null,

  reset: () => set({ ingredients: null, isLoading: false, error: null }),

  setLoading: (value) => set({ isLoading: value }),
  setError: (value) => set({ error: value }),
  setIngredients: (value) => set({ ingredients: value }),
  appendIngredient: (value) =>
    set((state) => ({
      ingredients: state.ingredients ? [...state.ingredients, value] : [value],
    })),
  removeIngredientLocal: (id) =>
    set((state) => ({
      ingredients: (state.ingredients ?? []).filter((i) => i.id !== id),
    })),
}));
