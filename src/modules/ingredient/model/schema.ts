import z from 'zod';

export const ingredientSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  category: z.enum(['VEGETABLES', 'FRUITS', 'MEAT', 'DAIRY', 'SPICES', 'OTHER']),
  unit: z.enum(['GRAMS', 'KILOGRAMS', 'LITERS', 'MILLILITERS', 'PIECES']),
  pricePerUnit: z.coerce
    .number()
    .refine((val) => !isNaN(val), 'Price must be number')
    .min(0, 'Price must be positive')
    .nullable(),
  description: z.string().optional(),
});
