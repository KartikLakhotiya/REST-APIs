import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from 'bcrypt';

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
    

    res.json({message:"User Created."})

}

export { createUser };