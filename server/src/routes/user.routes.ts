import { Router } from 'express';
import { userController } from '../controllers/user.controller';

// import { authMiddleware } from '../middlewares/auth.middleware'
// protéger les routes

const router = Router();

router.post('/', userController.createUser);
router.get('/:id', userController.getUserById);

export default router;
