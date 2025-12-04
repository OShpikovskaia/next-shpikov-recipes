import type { IIngredient } from './ingredient';

export interface IRecipeIngredient {
  id: string;
  ingredientId: string;
  quantity: number;
  ingredient: IIngredient;
}

export interface IRecipe {
  id: string;
  name: string;
  description: string;
  steps?: string;
  imageUrl?: string | null;
  ingredients: IRecipeIngredient[];
}
