import { CATEGORY_OPTIONS, UNIT_OPTIONS } from '@/constants/select-options';

const buildLabelMap = (options: readonly { value: string; label: string }[]) =>
  options.reduce<Record<string, string>>((acc, option) => {
    acc[option.value] = option.label;
    return acc;
  }, {});

const CATEGORY_LABELS = buildLabelMap(CATEGORY_OPTIONS);
const UNIT_LABELS = buildLabelMap(UNIT_OPTIONS);

export const getCategoryLabel = (value: string) => CATEGORY_LABELS[value] ?? value;
export const getUnitLabel = (value: string) => UNIT_LABELS[value] ?? value;

export const formatPricePerUnit = (price: number | null | undefined) => {
  if (price === null || price === undefined) {
    return '-';
  }

  const formatted = Number.isFinite(price) ? price.toFixed(2) : price.toString();
  return `$${formatted}`;
};
