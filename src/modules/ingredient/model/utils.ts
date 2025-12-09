import type { SortDescriptor } from '@heroui/react';

import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/modules/ingredient/model/select-options';

import type { IIngredient } from './type';

type Option = { value: string; label: string };

const buildLabelMap = (options: readonly Option[]) =>
  options.reduce<Record<string, string>>((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});

const CATEGORY_LABELS = buildLabelMap(CATEGORY_OPTIONS);
const UNIT_LABELS = buildLabelMap(UNIT_OPTIONS);

export const getCategoryLabel = (value: string) => CATEGORY_LABELS[value] ?? value;
export const getUnitLabel = (value: string) => UNIT_LABELS[value] ?? value;

export const formatPricePerUnit = (price?: number | null) => {
  if (price === null || price === undefined) {
    return '-';
  }

  const formatted = Number.isFinite(price) ? price.toFixed(2) : String(price);
  return `$${formatted}`;
};

type SortableValue = string | number | null | undefined;

const getSortableValue = (item: IIngredient, column: SortDescriptor['column']): SortableValue => {
  switch (column) {
    case 'name':
      return item.name;
    case 'category':
      return getCategoryLabel(item.category);
    case 'unit':
      return getUnitLabel(item.unit);
    case 'pricePerUnit':
      return item.pricePerUnit;
    default:
      return '';
  }
};

const compareValuesAsc = (a: SortableValue, b: SortableValue): number => {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  const aStr = String(a).toLowerCase();
  const bStr = String(b).toLowerCase();

  return aStr.localeCompare(bStr);
};

const sortIngredients = (items: IIngredient[], sortDescriptor: SortDescriptor): IIngredient[] => {
  if (!sortDescriptor.column) {
    return items;
  }

  const { column, direction } = sortDescriptor;
  const isDescending = direction === 'descending';

  return [...items].sort((a, b) => {
    const first = getSortableValue(a, column);
    const second = getSortableValue(b, column);

    const baseResult = compareValuesAsc(first, second);

    return isDescending ? -baseResult : baseResult;
  });
};

export const getFilteredAndSortedIngredients = ({
  ingredients,
  searchValue,
  sortDescriptor,
}: {
  ingredients: IIngredient[] | null;
  searchValue: string;
  sortDescriptor: SortDescriptor;
}): IIngredient[] => {
  if (!ingredients) return [];

  const query = searchValue.trim().toLowerCase();

  const filtered = query
    ? ingredients.filter((item) => {
        const name = item.name.toLowerCase();
        const description = (item.description ?? '').toLowerCase();
        const category = getCategoryLabel(item.category).toLowerCase();
        const unit = getUnitLabel(item.unit).toLowerCase();

        return (
          name.includes(query) ||
          description.includes(query) ||
          category.includes(query) ||
          unit.includes(query)
        );
      })
    : ingredients;

  return sortIngredients(filtered, sortDescriptor);
};
