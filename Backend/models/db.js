import mysql from 'mysql2';

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "dharshini@18",
    database: "ps_events",
});

// const pool = mysql.createPool({
//     user: "root",
//     host: "localhost",
//     password: "dharshini@18",
//     database: "ps_events",
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
//   });
  
// export default pool;


db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

export default db;
