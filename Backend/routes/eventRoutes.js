import express from 'express';
import { uploadEventFiles, handleEventUpload, getEvent, getEvents, updateEvent,  getStudentEvents } from '../controllers/eventController.js';
// import { getStudentDepartment } from '../controllers/studentController.js';

const router = express.Router();

// router.get('/students', getStudentDepartment);
router.get('/student-events', getStudentEvents);
// router.get('/department', getEventsByDepartment); 

router.post('/upload', uploadEventFiles, handleEventUpload);
router.get('/', getEvents);
router.get('/:id', getEvent);
// router.get('/department', getEventsByDepartment); 
router.put('/:id', uploadEventFiles, updateEvent);




export default router;
