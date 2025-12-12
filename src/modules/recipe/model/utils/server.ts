export const parseValidQuantity = (raw: unknown): number => {
  if (raw === null || raw === undefined || raw === '') {
    throw new Error('Quantity is required');
  }

  const value =
    typeof raw === 'number' ? raw : typeof raw === 'string' ? Number(raw.replace(',', '.')) : NaN;

  if (!Number.isFinite(value)) {
    throw new Error(`Quantity must be a number`);
  }

  if (value <= 0) {
    throw new Error(`Quantity must be greater than 0`);
  }

  return value;
};
