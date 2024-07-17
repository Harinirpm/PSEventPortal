import db from './db.js';

// Create Event Registration
export const createEventRegistration = (eventData, callback) => {
    const { eventName, teamName, projectTitle, projectObjective, existingMethodology, proposedMethodology, teamSize } = eventData;

    const sql = 'INSERT INTO event_registration SET ?';
    db.query(sql, {
        eventName,
        teamName,
        projectTitle,
        projectObjective,
        existingMethodology,
        proposedMethodology,
        teamSize
    }, (err, results) => {
        if (err) {
            console.error('Error creating event registration:', err);
            return callback(err);
        }
        callback(null, results.insertId);
    });
};

// Create Team Member
export const createTeamMember = (teamMemberData, callback) => {
    const sql = 'INSERT INTO team_members SET ?';
    db.query(sql, teamMemberData, (err, result) => {
        if (err) {
            console.error('Error creating team member:', err);
            return callback(err);
        }
        callback(null, result.insertId);
    });
};

// Check Duplicate Event Registration
export const checkDuplicateEventRegistration = (eventName, teamName, callback) => {
    const sql = 'SELECT * FROM event_registration WHERE eventName = ? AND teamName = ?';
    db.query(sql, [eventName, teamName], (err, results) => {
        if (err) {
            console.error('Error checking duplicate event registration:', err);
            return callback(err);
        }
        callback(null, results.length > 0); // Returns true if duplicate exists
    });
};
