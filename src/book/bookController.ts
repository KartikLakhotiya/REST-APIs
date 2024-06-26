import { NextFunction, Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { Multer } from "multer";
import path from "node:path";
import bookModel from "./bookModel";
import fs from 'node:fs';
import { AuthRequest } from "../middleware/authenticate";

const createBook = async(req: Request, res: Response, next:NextFunction) => {

    const {title, genre} = req.body;
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

    const _req = req as AuthRequest
    const newBook = await bookModel.create({
        title,
        genre,
        author: _req.userID,
        coverImage: uploadResult.secure_url,
        file: bookFileUploadResult.secure_url
    })

    // delete temp files.

    await fs.promises.unlink(filePath)
    await fs.promises.unlink(bookFilePath)


    
    
    res.status(201).json({id:newBook._id,message:"Book Registered."})
    console.log('Book Registered.')
}

const updateBook = async(req: Request, res:Response, next: NextFunction) => {

    const {title, genre} = req.body;
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({_id:bookId});
    if(!book){
        return res.status(404).json({message:"Book not found."})
    }


    const _req = req as AuthRequest

    if(book.author.toString() !== _req.userID){
        return res.status(403).json({message:"Unauthorized"})

    }

    // updating cover img.
    const files = req.files as {[feildname: string]: Express.Multer.File[]}; // this line is useful only when you are using multer.

    let completeCoverImage = ""
    if(files.coverImage){
        const filename = files.coverImage[0].filename;
        const coverMimeType = files.coverImage[0].mimetype.split('/').at(-1);
        const filePath = path.resolve(
            __dirname,
            '../../public/data/uploads'+ filename)

            completeCoverImage = `${filename}.${coverMimeType}`

            const uploadResult = await cloudinary.uploader.upload(filePath, {
                filename_override: completeCoverImage,
                folder: 'book-covers',
            })

            completeCoverImage = uploadResult.secure_url;
            await fs.promises.unlink(filePath)
    }

    let completeFileName = "";
    if(files.file){
        const bookFilePath = path.resolve(
            __dirname,
            "../../public/data/uploads/" + files.file[0].filename
        )

        const bookFileName = files.file[0].filename
        completeFileName
    }





    
    res.json({message:"Inside UpdateBook Function."})
    console.log('Update Book.')
}

export { createBook, updateBook };