import { create } from 'zustand';

import type { IIngredient } from './type';

type LoadStatus = 'idle' | 'loading' | 'success' | 'error';

interface IngredientState {
  ingredients: IIngredient[];
  status: LoadStatus;
  error: string | null;

  reset: () => void;

  startLoading: () => void;
  setLoaded: (value: IIngredient[]) => void;
  setFailed: (message: string) => void;

  appendIngredient: (value: IIngredient) => void;
  _removeIngredientLocal: (id: string) => void;
}

export const useIngredientStore = create<IngredientState>((set) => ({
  ingredients: [],
  status: 'idle',
  error: null,

  reset: () => set({ ingredients: [], status: 'idle', error: null }),

  startLoading: () => set({ status: 'loading', error: null }),
  setLoaded: (value) => set({ ingredients: value, status: 'success', error: null }),
  setFailed: (message) => set({ status: 'error', error: message }),

  appendIngredient: (value) => set((state) => ({ ingredients: [...state.ingredients, value] })),

  _removeIngredientLocal: (id) =>
    set((state) => ({ ingredients: state.ingredients.filter((i) => i.id !== id) })),
}));
