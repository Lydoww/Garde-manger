import type { RequestHandler } from 'express';
import { recipeService } from '@/services/recipe.service';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@/utils/errors';

interface RecipeParams {
  id?: string;
}

class RecipeController {
  getMyRecipes: RequestHandler<RecipeParams> = async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const userId = req.user.userId;

      const result = await recipeService.getRecipesByUserId(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getRecipeById: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError('Recipe ID required');
      }
      const recipeId = parseInt(id, 10);

      if (isNaN(recipeId)) {
        throw new BadRequestError('Invalid recipe ID');
      }

      const result = await recipeService.getRecipeById(recipeId);
      if (!result) {
        throw new NotFoundError('Recipe not found');
      }

      if (!req.user) {
        throw new UnauthorizedError();
      }
      if (result.userId !== req.user.userId) {
        throw new ForbiddenError('Not your recipe');
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  createRecipe: RequestHandler = async (req, res, next) => {
    try {
      if (!req.user) {
        throw new UnauthorizedError();
      }
      const recipeData = req.body;

      const userId = req.user.userId;

      const newRecipe = await recipeService.createRecipe(recipeData, userId);
      return res.status(201).json(newRecipe);
    } catch (error) {
      next(error);
    }
  };

  updateRecipe: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError('Recipe ID required');
      }
      const recipeId = parseInt(id, 10);
      if (isNaN(recipeId)) {
        throw new BadRequestError('Invalid recipe ID');
      }

      if (!req.user) {
        throw new UnauthorizedError();
      }

      const currentUser = req.user.userId;
      if (!currentUser) {
        throw new UnauthorizedError();
      }

      const recipe = await recipeService.getRecipeById(recipeId);
      if (!recipe) {
        throw new NotFoundError('Recipe not found');
      }

      if (recipe.userId !== currentUser) {
        throw new ForbiddenError('Not your recipe');
      }

      const updateData = req.body;

      const updatedRecipe = await recipeService.updateRecipe(
        recipeId,
        updateData
      );

      return res.status(200).json(updatedRecipe);
    } catch (error) {
      next(error);
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new BadRequestError('Recipe ID required');
      }
      const recipeId = parseInt(id, 10);
      if (isNaN(recipeId)) {
        throw new BadRequestError('Invalid recipe ID');
      }
      if (!req.user) {
        throw new UnauthorizedError();
      }

      const currentUser = req.user.userId;

      const recipe = await recipeService.getRecipeById(recipeId);
      if (!recipe) {
        throw new NotFoundError('Recipe not found');
      }

      if (recipe.userId !== currentUser) {
        throw new ForbiddenError('Not your recipe');
      }
      await recipeService.deleteRecipe(recipeId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const recipeController = new RecipeController();
