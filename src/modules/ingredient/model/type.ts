export interface IIngredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number | null;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  authorId: string | null;
}

export interface IngredientsFormData {
  name: string;
  category: string;
  unit: string;
  pricePerUnit: string;
  description?: string;
}
