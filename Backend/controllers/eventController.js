import { createEvent, getAllEvents, getEventById  } from '../models/eventModel.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
export const uploadEventFiles = upload.fields([
    { name: 'eventNotice', maxCount: 1 },
    { name: 'eventImage', maxCount: 1 }
]);

export const handleEventUpload = (req, res) => {
    const eventData = req.body;
    if (req.files['eventNotice']) {
        eventData.eventNotice = req.files['eventNotice'][0].path.replace(/\\/g, '/');
    }
    if (req.files['eventImage']) {
        eventData.eventImage = req.files['eventImage'][0].path.replace(/\\/g, '/');
    }

    //console.log('Received Event Data:', eventData);

    createEvent(eventData, (err, result) => {
        if (err) {
            console.error('Error inserting event data:', err);
            return res.status(500).json({ error: 'Failed to create event' });
        }
        res.status(201).json({ message: 'Event created successfully', eventId: result.insertId });
    });
};

export const getEvents = (req, res) => {
    getAllEvents((err, results) => {
        if (err) {
            console.error('Error retrieving events:', err);
            res.status(500).json({ error: 'Failed to retrieve events' });
        } else {
            console.log(results)
            res.status(200).json(results);
        }
    });
};

export const getEvent = (req, res) => {
    const { id } = req.params;
    getEventById(id, (err, event) => {
        if (err) {
            console.error('Error retrieving event:', err);
            return res.status(500).json({ error: 'Failed to retrieve event' });
        }
        if (!event || Object.keys(event).length === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json(event);
    });
};
