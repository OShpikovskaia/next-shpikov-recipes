'use client';

import { useMemo } from 'react';

import type { FilterType, IRecipe } from '../types';
import { getVisibleRecipes } from '../utils/client';

interface UseRecipesListStateArgs {
  recipes: IRecipe[];
  isAuth: boolean;
  currentUserId: string | null;
  filter: FilterType;
  searchQuery: string;
}

interface UseRecipesListStateResult {
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
  const hasRecipes = recipes.length > 0;

  const baseVisibleRecipes = useMemo(() => {
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
    return baseVisibleRecipes.filter((r) => r.name.toLowerCase().includes(q));
  }, [baseVisibleRecipes, searchQuery]);

  const { publicCount, myPrivateCount } = useMemo(() => {
    const publicCount = recipes.filter((r) => r.isPublic).length;
    const myPrivateCount = currentUserId
      ? recipes.filter((r) => !r.isPublic && r.authorId === currentUserId).length
      : 0;
    return { publicCount, myPrivateCount };
  }, [recipes, currentUserId]);

  return {
    hasRecipes,
    filteredRecipes,
    publicCount,
    myPrivateCount,
    totalInCurrentFilter: baseVisibleRecipes.length,
  };
};
