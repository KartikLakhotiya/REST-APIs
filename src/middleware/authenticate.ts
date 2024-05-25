import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt, { verify } from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
    userID: string
}


const autheticate = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')
    if(!token){
        return next(createHttpError(401,"Authorization token is required."))
    }

    const parsedToken = token.split(' ')[1];

    const decoded = verify(parsedToken, config.jwtSecret as string)
    console.log('Decoded Token', decoded)

    const _req = req as AuthRequest;
    _req.userID = decoded.sub as string;
    
    next();
}

export default autheticate;