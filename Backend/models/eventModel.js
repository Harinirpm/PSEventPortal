// models/eventModel.js
import db from './db.js';

export const createEvent = (eventData, callback) => {
    const sql = 'INSERT INTO events SET ?';
    db.query(sql, eventData, callback);
};

export const getAllEvents = (callback) => {
    const sql = 'SELECT * FROM events';
    db.query(sql, (err, results) => {
        if (err) return callback(err);

        const events = results.map(event => {
            if (typeof event.departments === 'string') {
                event.departments = event.departments.split(',').map(department => department.trim());
            }
            return event;
        });

        callback(null, events);
    });
};

export const getEventById = (id, callback) => {
    const sql = 'SELECT * FROM events WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);

        if (results.length === 0) {
            return callback(null, []);
        }

        const event = results[0];
        if (typeof event.departments === 'string') {
            event.departments = event.departments.split(',').map(department => department.trim());
        }

        callback(null, event);
    });
};

export const updateEventById = (id, eventData, callback) => {
    const sql = 'UPDATE events SET ? WHERE id = ?';
    db.query(sql, [eventData, id], callback);
};

export const getEventsByDepartmentFromModel = (department, callback) => {
    const sql = 'SELECT id,name, eventImage FROM events WHERE FIND_IN_SET(?, departments)';

    db.query(sql, [department], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            return callback(err);
        }
        callback(null, results); 
    });
};

