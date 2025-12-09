export const validatePriceInput = (value?: string | null) => {
  if (value === '' || value == null) {
    return 'Price is required';
  }

  const num = Number(value);

  if (Number.isNaN(num)) {
    return 'Price must be a number';
  }

  if (num < 0) {
    return 'Price must be greater or equal to 0';
  }

  return null;
};
