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

export const getTeamsForEvent = (eventName, callback) => {
  const sql = 'SELECT * FROM event_registration WHERE eventName = ? AND level1 = 0 AND rejected IS NULL';
  db.query(sql, [eventName], (err, results) => {
    if (err) {
      console.error('Error fetching teams for event:', err);
      return callback(err);
    }
    callback(null, results);
  });
};

export const getTeamDetails = (eventId, teamName, callback) => {
  // First Query: Fetch Event Registration Details
  const eventRegistrationQuery = `
 SELECT 
  eventId, eventName, teamName, projectTitle, projectObjective, 
  existingMethodology, proposedMethodology, teamSize
FROM event_registration
WHERE eventId = ? AND teamName = ?
  `;

  // Second Query: Fetch Team Members Details
  const teamMembersQuery = `
      SELECT 
        name, email, rollNo, year, department, isTeamLeader
      FROM team_members
      WHERE eventId = ? AND teamName = ?
    `;

  // Run both queries sequentially
  db.query(eventRegistrationQuery, [eventId, teamName], (err, eventResults) => {
    if (err) {
      console.error('Error fetching event registration details:', err);
      return callback(err);
    }
    if (eventResults.length === 0) {
      return callback(null, { error: 'Event or team not found' });
    }
    console.log(eventResults[0])

    const eventDetails = eventResults[0];

    db.query(teamMembersQuery, [eventId, teamName], (err, memberResults) => {
      if (err) {
        console.error('Error fetching team members details:', err);
        return callback(err);
      }

      // Combine results
      const teamDetails = {
        ...eventDetails,
        members: memberResults
      };

      console.log(teamDetails)

      return callback(null, teamDetails);
    });
  });
};

export const approveTeamInModel = (eventId, teamName, callback) => {
  const sql = 'UPDATE event_registration SET level1 = 1 WHERE eventId = ? AND teamName = ?';
  db.query(sql, [eventId, teamName], callback);
};

export const rejectTeamInModel = (eventId, teamName, rejectionReason, callback) => {
  const sql = 'UPDATE event_registration SET rejected = ? WHERE eventId = ? AND teamName = ?';
  db.query(sql, [rejectionReason, eventId, teamName], callback);
};
