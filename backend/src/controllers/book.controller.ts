import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { z } from "zod"
import { client } from "../db/connectDB";
import ApiResponse from "../utils/apiResponse";
import Apierror from "../utils/apiError";

interface User extends Request {
    user?: any
}
const bookRegistrationSchema = z.object({
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }).trim().min(1, 'Title cannot be empty'),
    publishedYear: z.number().int().positive().gte(1800).lte(2023)
})
const bookRegistration = asyncHandler(async (req: User, res: Response) => {
    const userId = req.user.id
    const { title, publishedYear } = bookRegistrationSchema.parse(req.body)
    const bookCheck = await client.query(`SELECT * FROM books WHERE title=$1 AND authorid=$2`, [title, userId])
    if (bookCheck.rows.length !== 0) {
        throw new Apierror({
            message: "Book is already registered, enter a new book",
            statusCode: 409,
            success: false
        })
    }
    const newBook = await client.query(`INSERT INTO books (title,publishedYear,authorid) VALUES($1,$2,$3)`, [title, publishedYear, userId])
    res.status(201).json(
        new ApiResponse({
            message: "Book successfully registered into the database",
            statusCode: 200,
            success: true,
            data: userId
        })
    )
})


const getAllRegistredBooks = asyncHandler(async (req: User, res: Response) => {
    const userId = req.user.id
    console.log(userId);

    const allBooks = await client.query(`SELECT * FROM books WHERE authorid=$1`, [userId])
    if (!allBooks) {
        res.status(200).json("Please register books!")
    }
    res.status(200).json(
        new ApiResponse({
            message: "Succesfull",
            statusCode: 200,
            success: true,
            data: [allBooks.rows.map(data => ({ title: data.title, year: data.publishedyear })), userId]
        })
    )
})

const updateBookSchema = z.object({
    bookid: z.number(),
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }).trim().min(1, 'Title cannot be empty'),
    publishedYear: z.number().int().positive().gte(1800).lte(2023)
})
const updateBook = asyncHandler(async (req: User, res: Response) => {
    const userId = req.user.id
    const { bookid, title, publishedYear } = updateBookSchema.parse(req.body)
    const existingBook = await client.query(`SELECT title,bookid FROM books WHERE bookid=$1 AND authorid=$2`, [bookid, userId])

    if (existingBook.rows.length == 0) {
        throw new Apierror({
            message: "No book is there to be updated",
            statusCode: 400,
            success: false
        })
    }
    await client.query(`UPDATE books SET title=$1,publishedyear=$2 WHERE authorid=$3 AND bookid=$4`, [title, publishedYear, userId, bookid])
    res.status(200).json(
        new ApiResponse({
            message: "Book updated successfully",
            statusCode: 200,
            success: true
        })
    )
})

const deleteBookSchema = z.object({
    bookid: z.number(),
    title: z.string({
        required_error: "Title is required",
        invalid_type_error: "Title must be a string"
    }).trim().min(1, 'Title cannot be empty'),
    publishedYear: z.number().int().positive().gte(1800).lte(2023)
})

const deleteBook = asyncHandler(async (req: User, res: Response) => {
    const userId = req.user.id
    const { bookid, title, publishedYear } = updateBookSchema.parse(req.body)
    const existingBook = await client.query(`SELECT title,bookid FROM books WHERE bookid=$1 AND authorid=$2`, [bookid, userId])

    if (existingBook.rows.length == 0) {
        throw new Apierror({
            message: "No book is there to be deleted",
            statusCode: 400,
            success: false
        })
    }
    await client.query("DELETE FROM books WHERE bookid=$1 AND authorid =$2", [bookid, userId])
    res.status(200).json(
        new ApiResponse({
            message: "Book is deleted successfully",
            statusCode: 200,
            success: true
        })
    )
})
export {
    bookRegistration,
    getAllRegistredBooks,
    updateBook,
    deleteBook
}