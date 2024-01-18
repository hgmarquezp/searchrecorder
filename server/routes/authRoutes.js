import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/inicio-sesion', authController.login);

export default router;