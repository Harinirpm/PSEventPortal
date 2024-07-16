import db from './db.js';

export const getStudentByEmail = (email, callback) => {
    const sql = 'SELECT * FROM student WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) return callback(err);
        callback(null, results);
    });
};
