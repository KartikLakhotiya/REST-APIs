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
    
    res.status(201).json({accessToken : token})
}

const loginUser = async(req: Request,res:Response,next:NextFunction) => {
    const {email, password } = req.body;
    if( !email || !password){
        const error = createHttpError(400,"All Feilds are required.")
        return next(error);
    }

    const user = await userModel.findOne({email})
    if(!user){
        return next(createHttpError(404,"User Not Found."))
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if(!isMatch){
        return next(createHttpError(400,"Username or Password Incorrect."))
    }

    //create access token.
    const token = sign({sub: user._id},config.jwtSecret as string,{expiresIn:"7d", algorithm:"HS256"});
    res.json({message:"User Logged in",accessToken: token})

}


export { createUser,loginUser };