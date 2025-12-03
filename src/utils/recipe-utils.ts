import { UNIT_ABBREVIATIONS } from '@/constants/select-options';

export const formatUnitLabel = (unit: string) => {
  const unitOption = UNIT_ABBREVIATIONS.find((option) => option.value === unit);
  return unitOption ? unitOption.label : unit.toLowerCase();
};

export const splitDescriptionLines = (value?: string | null) => {
  if (!value) {
    return [];
  }

  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
};
