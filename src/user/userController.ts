import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";

const createUser = async(req: Request,res:Response,next:NextFunction) => {
    console.log("reqdata",req.body)
    // return res.json({msg:"world"})
    const {name,email,password} = req.body;

    if(!name || !email || !password){
        const error = createHttpError(400,"All Feilds are required.")
        return next(error);
    }
    res.json({message:"User Created."})

}

export { createUser };