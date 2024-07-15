import express from 'express';
import multer from 'multer';
import { uploadEventFiles, handleEventUpload, getEvent,getEvents  } from '../controllers/eventController.js';

const router = express.Router();

router.post('/upload', uploadEventFiles, handleEventUpload);

router.get('/', getEvents);
router.get('/:id', getEvent);

export default router;
