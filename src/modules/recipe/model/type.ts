import type { IIngredient } from '../../ingredient/model/type';

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
  isPublic: boolean;
  authorId: string | null;
  ingredients: IRecipeIngredient[];
}

export type FilterType = 'all' | 'public' | 'mine';
