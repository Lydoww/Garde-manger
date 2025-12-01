import { Router } from 'express';
import { userController } from '@/controllers/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

router.get('/:id', authMiddleware, userController.getUserById);
router.patch('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.delete);

export default router;
