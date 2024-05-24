import express from "express";
import { createBook } from "./bookCOntroller";

const bookRouter = express.Router();

bookRouter.post('/',createBook)

export default bookRouter;