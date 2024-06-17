import express from "express";
import { createBook, updateBook } from "./bookController";
import multer from "multer";
import path from "node:path";
import autheticate from "../middleware/authenticate";

const bookRouter = express.Router();

// adding multer as middleware for managing files.

const upload = multer({
    dest: path.resolve(__dirname,'../../public/data/uploads'),
    limits: {fileSize: 3e7}
})


// Create Book
bookRouter.post('/',autheticate,upload.fields([
    {name:'coverImage', maxCount:1},
    {name: 'file',maxCount:1}
]),createBook)

// Update Book.
bookRouter.patch('/bookId',
                autheticate,
                upload.fields([
                    {name:'coverImage', maxCount:1},
                    {name: 'file',maxCount:1}
                ]),updateBook)

export default bookRouter;