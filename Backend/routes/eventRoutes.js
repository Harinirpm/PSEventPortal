import express from 'express';
import multer from 'multer';
import { uploadEventFiles, handleEventUpload, getEvent,getEvents, updateEvent  } from '../controllers/eventController.js';

const router = express.Router();

router.post('/upload', uploadEventFiles, handleEventUpload);

router.get('/', getEvents);
router.get('/:id', getEvent);

router.put('/:id', uploadEventFiles, updateEvent); 

export default router;
