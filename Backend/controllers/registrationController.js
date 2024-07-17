import { createEventRegistration, createTeamMember, checkDuplicateEventRegistration } from '../models/registrationModel.js';
import db from '../models/db.js'; // Assuming db.js exports the database connection

export const createEvent = (req, res) => {
    const { initialData, teamMembers } = req.body;

    // Start a transaction
    db.beginTransaction(err => {
        if (err) return res.status(500).json({ error: 'Database error starting transaction' });

        checkDuplicateEventRegistration(initialData.eventName, initialData.teamName, (err, isDuplicate) => {
            if (err) {
                return db.rollback(() => {
                    res.status(500).json({ error: 'Database error checking duplicate registration' });
                });
            }

            if (isDuplicate) {
                return db.rollback(() => {
                    res.status(400).json({ error: 'Team Name already exists' });
                });
            }

            createEventRegistration(initialData, (err, eventId) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: 'Database error creating event registration' });
                    });
                }

                const teamLeaderData = {
                    teamName: initialData.teamName,
                    eventId: eventId,
                    name: initialData.teamLeaderName,
                    email: initialData.email,
                    rollNo: initialData.rollNo,
                    year: initialData.year,
                    department: initialData.department,
                    isTeamLeader: true
                };

                createTeamMember(teamLeaderData, (err, teamLeaderId) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: 'Database error creating team leader' });
                        });
                    }

                    const teamMemberPromises = teamMembers.map(member => {
                        const teamMemberData = {
                            teamName: initialData.teamName,
                            eventId: eventId,
                            name: member.name,
                            email: member.email,
                            rollNo: member.rollNo,
                            year: member.year,
                            department: member.department,
                            isTeamLeader: false
                        };

                        return new Promise((resolve, reject) => {
                            createTeamMember(teamMemberData, (err, teamMemberId) => {
                                if (err) {
                                    console.error('Error creating team member:', err);
                                    return reject(err);
                                }
                                resolve(teamMemberId);
                            });
                        });
                    });

                    Promise.all(teamMemberPromises)
                        .then(() => {
                            db.commit(err => {
                                if (err) {
                                    return db.rollback(() => {
                                        res.status(500).json({ error: 'Database error committing transaction' });
                                    });
                                }
                                res.status(201).json({ message: 'Event registration, team leader, and team members created successfully' });
                            });
                        })
                        .catch(err => {
                            db.rollback(() => {
                                res.status(500).json({ error: 'Database error creating team members' });
                            });
                        });
                });
            });
        });
    });
};
