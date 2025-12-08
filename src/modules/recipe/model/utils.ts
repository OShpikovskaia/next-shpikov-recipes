import { UNIT_ABBREVIATIONS } from '@/modules/ingredient/model/select-options';

export const formatUnitLabel = (unit: string) => {
  const unitOption = UNIT_ABBREVIATIONS.find((option) => option.value === unit);
  return unitOption ? unitOption.label : unit.toLowerCase();
};
