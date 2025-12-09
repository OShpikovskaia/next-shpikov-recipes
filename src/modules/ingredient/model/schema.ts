import { z } from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  category: z.enum(['VEGETABLES', 'FRUITS', 'MEAT', 'DAIRY', 'SPICES', 'OTHER']),
  unit: z.enum(['GRAMS', 'KILOGRAMS', 'LITERS', 'MILLILITERS', 'PIECES']),
  pricePerUnit: z.preprocess(
    (raw) => {
      if (raw === '' || raw == null) {
        return undefined;
      }
      return raw;
    },
    z.coerce.number().min(0, { message: 'Price must be greater or equal to 0' }),
  ),
  description: z.string().optional(),
});
