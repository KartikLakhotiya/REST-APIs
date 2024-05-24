import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { Multer } from "multer";
import path from "node:path";

const createBook = async(req: Request, res: Response, next:NextFunction) => {

    console.log('files', req.files);

    const files = req.files as {[feildname: string]: Express.Multer.File[]}; // this line is useful only when you are using multer.

    const coverImageMimeType = files.coverImage[0].mimetype.split('/').at(-1);
    const fileName = files.coverImage[0].filename;
    const filePath = path.resolve(__dirname,'../../public/data/uploads',fileName)

    const uploadResult = await cloudinary.uploader.upload(filePath, {
        filename_override: fileName,
        folder: 'book-covers',
        format: coverImageMimeType,
    })

    const bookFileName = files.file[0].filename;
    const bookFilePath = path.resolve(__dirname,'../../public/data/uploads',bookFileName)

    const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath,{
        resource_type: 'raw',
        filename_override: bookFileName,
        folder: 'book-pdfs',
        format: "pdf",
    })

    console.log('Book upload Result',bookFileUploadResult)
    console.log('file upload result',uploadResult)
    
    res.json({message:"Form Data Received."})
}

export { createBook };