export interface IFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface IngredientsFormData {
  name: string;
  category: string;
  unit: string;
  pricePerUnit: string;
  description?: string;
}
