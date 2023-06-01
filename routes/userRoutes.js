import express, { Router } from 'express';
const router = express.Router();
import { loginController,signinController,getUserController } from '../controllers/userControllers.js';

router.post('/login',loginController);
router.post('/signin',signinController);
router.get('/',getUserController);

export {router as userRoutes}