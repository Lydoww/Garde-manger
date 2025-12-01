import { prisma } from '@/config/database';
import type { Recipe } from '@prisma/client';

interface CreateRecipeDTO {
  title: string;
  description: string;
  imageUrl: string;
  time: string;
  categories: string[];
  ingredients: string[];
  isFavorite?: boolean;
  videoUrl?: string;
  userId: number;
}

interface UpdateRecipeDTO {
  title?: string;
  description?: string;
  isFavorite?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  time?: string;
  categories?: string[];
  ingredients?: string[];
}

class RecipeService {
  async getRecipesByUserId(userId: number): Promise<Recipe[]> {
    const recipes = await prisma.recipe.findMany({
      where: { userId },
    });
    return recipes;
  }

  async getRecipeById(recipeId: number): Promise<Recipe | null> {
    const recipe = await prisma.recipe.findUnique({
      where: { id: recipeId },
    });
    return recipe;
  }

  async createRecipe(
    recipeData: CreateRecipeDTO,
    userId: number
  ): Promise<Recipe> {
    const newRecipe = await prisma.recipe.create({
      data: { ...recipeData, userId: userId },
    });
    return newRecipe;
  }

  async updateRecipe(
    recipeId: number,
    updatedData: UpdateRecipeDTO
  ): Promise<Recipe> {
    const recipe = await prisma.recipe.update({
      where: { id: recipeId },
      data: updatedData,
    });
    return recipe;
  }

  async deleteRecipe(recipeId: number): Promise<void> {
    await prisma.recipe.delete({
      where: { id: recipeId },
    });
  }
}

export const recipeService = new RecipeService();
