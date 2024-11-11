import express from 'express';
import { registerUser, loginUser, getUser } from '../controllers/user.controller';
import { authenticateJWT } from '../middlewares/authenticateJWT';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginUser);

router.get('/user/:id', authenticateJWT, getUser);

export default router;
