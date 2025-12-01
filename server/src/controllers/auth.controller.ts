import { authService } from '@/services/auth.service';
import type { RequestHandler } from 'express';

class AuthController {
  register: RequestHandler = async (req, res, next) => {
    try {
      const userData = req.body;
      const result = await authService.register(userData);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  };

  login: RequestHandler = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  refreshToken: RequestHandler = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token required' });
      }
      const result = await authService.refreshToken(refreshToken);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  logOut: RequestHandler = async (req, res, next) => {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({ message: 'User is not connected' });
      }
      await authService.logout(userId);
      return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      next(error);
    }
  };

 
}

export const authController = new AuthController();
