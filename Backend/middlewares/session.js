import session from 'express-session';

const sessionMiddleware = session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: 'lax'
    }
});

export default sessionMiddleware;
