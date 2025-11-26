import type { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';

class UserController {
  async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const userData = req.body;
      const result = await userService.createUser(userData);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user ID' });
      }

      const result = await userService.getUserById(userId);

      if (!result) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
