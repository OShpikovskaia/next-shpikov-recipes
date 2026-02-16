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
  totalAccessible: number; // New
  totalInCurrentFilter: number; // tab total
}
export const useRecipesListState = ({
  recipes,
  isAuth,
  currentUserId,
  filter,
  searchQuery,
}: UseRecipesListStateArgs): UseRecipesListStateResult => {
  const hasRecipes = recipes.length > 0;

  // what user can access at all (no tab filter)
  const accessibleRecipes = useMemo(() => {
    return getVisibleRecipes({
      recipes,
      isAuth,
      filter: 'all', // Important: no tab here
      currentUserId,
    });
  }, [recipes, isAuth, currentUserId]);

  // what user can access in current tab (no search)
  const recipesInTab = useMemo(() => {
    return getVisibleRecipes({
      recipes,
      isAuth,
      filter,
      currentUserId,
    });
  }, [recipes, isAuth, filter, currentUserId]);

  // apply search on top of tab
  const filteredRecipes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return recipesInTab;
    return recipesInTab.filter((r) => r.name.toLowerCase().includes(q));
  }, [recipesInTab, searchQuery]);

  // counts (I’d keep these as "accessible counts" too)
  const { publicCount, myPrivateCount } = useMemo(() => {
    const base = accessibleRecipes;
    const publicCount = base.filter((r) => r.isPublic).length;
    const myPrivateCount = currentUserId
      ? base.filter((r) => !r.isPublic && r.authorId === currentUserId).length
      : 0;
    return { publicCount, myPrivateCount };
  }, [accessibleRecipes, currentUserId]);

  return {
    hasRecipes,
    filteredRecipes,
    publicCount,
    myPrivateCount,
    totalAccessible: accessibleRecipes.length,
    totalInCurrentFilter: recipesInTab.length,
  };
};
