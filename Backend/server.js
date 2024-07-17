import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sessionMiddleware from './middlewares/session.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import registrationRoutes from './routes/registrationRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173"],
    allowedHeaders: ['Content-Type'],
    methods: ["POST", "GET", "PUT", "OPTIONS"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(sessionMiddleware);
app.use(bodyParser.urlencoded({ extended: true }));

const dir = path.join(__dirname, 'uploads');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', userRoutes);
app.use('/events', eventRoutes);
app.use('/register', registrationRoutes);

app.listen(8081, () => {
    console.log("Server running on port 8081");
});
