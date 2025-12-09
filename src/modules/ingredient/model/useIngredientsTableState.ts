'use client';

import { useMemo, useState } from 'react';
import type { SortDescriptor } from '@heroui/react';

import type { IIngredient } from './type';
import { getFilteredAndSortedIngredients } from './utils';

interface UseIngredientsTableStateParams {
  ingredients: IIngredient[] | null;
}

export const useIngredientsTableState = ({ ingredients }: UseIngredientsTableStateParams) => {
  const [searchValue, setSearchValue] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: 'name',
    direction: 'ascending',
  });

  const filteredAndSorted = useMemo(
    () =>
      getFilteredAndSortedIngredients({
        ingredients,
        searchValue,
        sortDescriptor,
      }),
    [ingredients, searchValue, sortDescriptor],
  );

  const hasAnyIngredients = Array.isArray(ingredients) && ingredients.length > 0;
  const isSearching = searchValue.trim().length > 0;

  return {
    searchValue,
    setSearchValue,
    sortDescriptor,
    setSortDescriptor,
    filteredAndSorted,
    hasAnyIngredients,
    isSearching,
  };
};
