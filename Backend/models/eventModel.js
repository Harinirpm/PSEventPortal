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
        //console.log(results)

        callback(null, events);
    });
};

export const getEventById = (id, callback) => {
    const sql = 'SELECT * FROM events WHERE id = ?';
    db.query(sql, [id], (err, results) => {
        if (err) return callback(err);

        //console.log(results)

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
