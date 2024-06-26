import express, { NextFunction, Request, Response } from 'express'
import createHttpError, { HttpError } from 'http-errors';
import { config } from './config/config';
import userRouter from './user/userRouter';
import bookRouter from './book/bookRouter';
const app = express();

app.use(express.json())

// Routes

app.get('/', (req, res) => {
    res.json({message:"Welcome to my EBook Store."})
    const error = createHttpError(400,"Something went wrong.")
    throw error;
});

app.use("/api/users",userRouter);
app.use("/api/books",bookRouter);

// global error handler always comes at last.

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    return res.status(statusCode).json({
        message: err.message,
        errorStack: config.env === 'development' ? err.stack : '',

    })
})

export default app;