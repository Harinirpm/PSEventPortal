import mysql from 'mysql2';

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "dharshini@18",
    database: "ps_events",
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

export default db;
