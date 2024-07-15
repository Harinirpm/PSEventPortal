import express from 'express';
import { loginUser, checkSession, logoutUser } from '../controllers/userController.js';

const router = express.Router();

router.post('/login', loginUser);
router.get('/', checkSession);
router.get('/logout', logoutUser);

export default router;
