export interface IIngredient {
  id: string;
  name: string;
  category: string;
  unit: string;
  pricePerUnit: number | null;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IngredientsFormData {
  name: string;
  category: string;
  unit: string;
  pricePerUnit: string;
  description?: string;
}
