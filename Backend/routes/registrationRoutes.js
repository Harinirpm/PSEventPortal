import express from 'express';
import { createEvent } from '../controllers/registrationController.js';

const router = express.Router();

router.post('/team-details', createEvent);

export default router;
