import express, { NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors';
import { config } from './config/config';
const app = express();

// Routes

app.get('/', (req, res) => {
    res.json({message:"Welcome to my EBook Store."})
});

// global error handler always comes at last.

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        message: err.message,
        errorStack: config.env === 'development' ? err.stack : '',

    })
})

export default app;