import { z } from 'zod';

export const createRecipeSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  imageUrl: z.string().url(),
  videoUrl: z.string().url().optional(),
  time: z.string().min(1).max(50),
  categories: z.array(z.string()).min(1).max(10),
  ingredients: z.array(z.string()).min(1).max(50),
  isFavorite: z.boolean().optional(),
});

export const updateRecipeSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  imageUrl: z.string().min(1).optional(),
  videoUrl: z.string().optional(),
  time: z.string().min(1).optional(),
  categories: z.array(z.string()).min(1).optional(),
  ingredients: z.array(z.string()).min(1).optional(),
  isFavorite: z.boolean().optional(),
});
