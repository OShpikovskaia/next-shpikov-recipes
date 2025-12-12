import { UNIT_ABBREVIATIONS } from '@/modules/ingredient/model/select-options';

import type { FilterType, IRecipe } from '../types';

export const formatUnitLabel = (unit: string) => {
  const unitOption = UNIT_ABBREVIATIONS.find((option) => option.value === unit);
  return unitOption ? unitOption.label : unit.toLowerCase();
};

export const getVisibleRecipes = ({
  recipes,
  isAuth,
  filter,
  currentUserId,
}: {
  recipes: IRecipe[];
  isAuth: boolean;
  filter: FilterType;
  currentUserId: string | null;
}) => {
  if (!isAuth) {
    return recipes.filter((recipe) => recipe.isPublic);
  }

  switch (filter) {
    case 'public':
      return recipes.filter((recipe) => recipe.isPublic);
    case 'mine':
      return recipes.filter((recipe) => recipe.authorId && recipe.authorId === currentUserId);
    case 'all':
    default:
      return recipes;
  }
};
