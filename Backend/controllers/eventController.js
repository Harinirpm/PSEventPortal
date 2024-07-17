import { createEvent, getAllEvents, getEventById, updateEventById, getEventsByDepartmentFromModel, getTeamsForEvent, getTeamDetails,approveTeamInModel, rejectTeamInModel  } from '../models/eventModel.js';
import { getStudentByEmail } from '../models/studentModel.js';
import multer from 'multer';
import path from 'path';
import { formatISO } from 'date-fns';

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

export const updateEvent = (req, res) => {
    const { id } = req.params;
    const eventData = req.body;

    // Convert dates to MySQL acceptable format
    if (eventData.eventStartDate) {
        eventData.eventStartDate = formatISO(new Date(eventData.eventStartDate), { representation: 'date' });
    }
    if (eventData.eventEndDate) {
        eventData.eventEndDate = formatISO(new Date(eventData.eventEndDate), { representation: 'date' });
    }
    if (eventData.registrationStartDate) {
        eventData.registrationStartDate = formatISO(new Date(eventData.registrationStartDate), { representation: 'date' });
    }
    if (eventData.registrationEndDate) {
        eventData.registrationEndDate = formatISO(new Date(eventData.registrationEndDate), { representation: 'date' });
    }

    if (req.files['eventNotice']) {
        eventData.eventNotice = req.files['eventNotice'][0].path.replace(/\\/g, '/');
    }
    if (req.files['eventImage']) {
        eventData.eventImage = req.files['eventImage'][0].path.replace(/\\/g, '/');
    }

    updateEventById(id, eventData, (err, result) => {
        if (err) {
            console.error('Error updating event:', err);
            return res.status(500).json({ error: 'Failed to update event' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: 'Event updated successfully' });
    });
};

export const getStudentEvents = (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    getStudentByEmail(email, (err, studentResults) => {
        if (err) {
            console.error('Error retrieving student data:', err);
            return res.status(500).json({ error: 'Failed to retrieve student data' });
        }

        if (studentResults.length === 0) {
            return res.status(404).json({ error: 'Student not found' });
        }

        const studentData = studentResults[0];
        const department = studentData.department;

        getEventsByDepartmentFromModel(department, (err, eventsResults) => {
            if (err) {
                console.error('Error retrieving events by department:', err);
                return res.status(500).json({ error: 'Failed to retrieve events' });
            }

            res.status(200).json({
                department,
                events: eventsResults
            });
        });
    });
};

export const fetchTeamsForEvent = (req, res) => {
    const { eventName } = req.params;
    getTeamsForEvent(eventName, (err, teams) => {
        if (err) return res.status(500).json({ error: 'Database error fetching teams' });
        res.status(200).json(teams);
    });
};

export const fetchTeamDetails = (req, res) => {
    const { eventId, teamName } = req.params;
    getTeamDetails(eventId, teamName, (err, teamDetails) => {
        if (err) return res.status(500).json({ error: 'Database error fetching team details' });
        if (!teamDetails) return res.status(404).json({ error: 'Team not found' });
        res.status(200).json(teamDetails);
    });
};

export const approveTeam = (req, res) => {
    const { eventId, teamName } = req.params;
    approveTeamInModel(eventId, teamName, (err) => {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      res.json({ message: 'Team approved successfully' });
    });
  };
  
  export const rejectTeam = (req, res) => {
    const { eventId, teamName } = req.params;
    const { rejectionReason } = req.body;
    rejectTeamInModel(eventId, teamName, rejectionReason, (err) => {
      if (err) return res.status(500).json({ error: 'Internal server error' });
      res.json({ message: 'Team rejected successfully' });
    });
  };
