'use client';

import { useMemo } from 'react';

import type { FilterType, IRecipe } from './type';
import { getVisibleRecipes } from './utils';

interface UseRecipesListStateArgs {
  recipes: IRecipe[] | null;
  isAuth: boolean;
  currentUserId: string | null;
  filter: FilterType;
  searchQuery: string;
}

interface UseRecipesListStateResult {
  isInitial: boolean;
  hasRecipes: boolean;
  filteredRecipes: IRecipe[];
  publicCount: number;
  myPrivateCount: number;
  totalInCurrentFilter: number;
}

export const useRecipesListState = ({
  recipes,
  isAuth,
  currentUserId,
  filter,
  searchQuery,
}: UseRecipesListStateArgs): UseRecipesListStateResult => {
  const isInitial = recipes === null;
  const hasRecipes = Array.isArray(recipes) && recipes.length > 0;

  const baseVisibleRecipes = useMemo(() => {
    if (!recipes) return [];

    return getVisibleRecipes({
      recipes,
      isAuth,
      filter,
      currentUserId,
    });
  }, [recipes, isAuth, filter, currentUserId]);

  const filteredRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return baseVisibleRecipes;

    return baseVisibleRecipes.filter((recipe) => recipe.name.toLowerCase().includes(q));
  }, [baseVisibleRecipes, searchQuery]);

  const { publicCount, myPrivateCount } = useMemo(() => {
    if (!recipes) {
      return { publicCount: 0, myPrivateCount: 0 };
    }

    const publicCount = recipes.filter((r) => r.isPublic).length;

    const myPrivateCount =
      currentUserId != null
        ? recipes.filter((r) => !r.isPublic && r.authorId === currentUserId).length
        : 0;

    return { publicCount, myPrivateCount };
  }, [recipes, currentUserId]);

  const totalInCurrentFilter = baseVisibleRecipes.length;

  return {
    isInitial,
    hasRecipes,
    filteredRecipes,
    publicCount,
    myPrivateCount,
    totalInCurrentFilter,
  };
};
