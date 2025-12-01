import type { RequestHandler } from 'express';
import { userService } from '@/services/user.service';
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
  UnauthorizedError,
} from '@/utils/errors';

interface UserParams {
  id?: string;
}

class UserController {
  getUserById: RequestHandler = async (req, res, next) => {
    try {
      const { id } = req.params;

      if (!id) {
        throw new BadRequestError('User ID is required');
      }

      const userId = parseInt(id, 10);

      if (isNaN(userId)) {
        throw new BadRequestError();
      }

      const result = await userService.getUserById(userId);

      if (!result) {
        throw new NotFoundError('User not found');
      }

      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  updateUser: RequestHandler<UserParams> = async (req, res, next) => {
    try {
      const id = req.params.id;

      if (!id) {
        throw new BadRequestError();
      }

      const userId = parseInt(id, 10);
      if (isNaN(userId)) {
        throw new BadRequestError();
      }
      const currentUserId = req.user?.userId;

      if (!currentUserId) {
        throw new UnauthorizedError();
      }

      if (userId !== currentUserId) {
        throw new ForbiddenError('Not your profile, you cannot update');
      }

      const { email, username } = req.body;

      const updatedUser = await userService.updateUser(userId, {
        email,
        username,
      });

      return res.status(200).json({
        message: 'User updated successfully',
        user: {
          id: updatedUser.id,
          email: updatedUser.email,
          username: updatedUser.username,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  delete: RequestHandler = async (req, res, next) => {
    try {
      const id = req.params.id;
      if (!id) {
        throw new BadRequestError();
      }

      const userId = parseInt(id);
      if (isNaN(userId)) {
        throw new BadRequestError();
      }

      if (!req.user) {
        throw new UnauthorizedError();
      }

      const currentUserId = req.user.userId;
      if (!currentUserId) {
        throw new UnauthorizedError();
      }
      if (userId !== currentUserId) {
        throw new ForbiddenError('Not your profile, you cannot delete');
      }
      await userService.delete(userId);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export const userController = new UserController();
