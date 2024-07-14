import express from 'express';
import mysql from 'mysql2'; 
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import bodyParser from 'body-parser';

const app = express();
app.use(express.json());
app.use(cors({
         origin: ["http://localhost:5173"],
         methods : ["POST","GET"],
         credentials : true
}));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        maxAge: 1000 * 60* 60* 2
    }
}))

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

app.post('/login', (req, res) => {
    const sql = 'SELECT * FROM user WHERE email = ? AND password = ?';
    const { email, password } = req.body;

    db.query(sql, [email, password], (err, data) => {
        if (err) {
            console.log(err);
            return res.json({ Error: "Login error in server" });
        }
        if (data.length > 0) {
            req.session.role=data[0].role
           // console.log(req.session.name)
            return res.json({ Status: "Success"});
        } else {
            return res.json({ Error: "No such user existed" });
        }
    });
});

app.get('/',(req,res)=>{
    if(req.session.role){
        return res.json({valid: true, role: req.session.role})
    }
    else{
        return res.json({valid: false})
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logout successful' });
    });
});

app.listen(8081, () => {
    console.log("server running");
});
