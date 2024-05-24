import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';
import { sign } from "jsonwebtoken";
import { config } from "../config/config";

const createUser = async(req: Request,res:Response,next:NextFunction) => {
    console.log("reqdata",req.body)
    // return res.json({msg:"world"})
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        const error = createHttpError(400,"All Feilds are required.")
        return next(error);
    }

    // Database Call
    const user = await userModel.findOne({email})
    if(user){
        const error = createHttpError(400,"Email Already Registered,")
        return next(error)
    }

    // password hashing.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Adding user to database.

    const newUser = await userModel.create({name,email,password: hashedPassword})

    
    // Token Generation (JWT)
    const token = sign({sub: newUser._id},config.jwtSecret as string,{expiresIn:"7d", algorithm:"HS256"});
    
    res.json({accessToken : token})
}

export { createUser };