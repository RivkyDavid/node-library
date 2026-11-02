import { use } from "react";
import Book from "../models/book.model.js";
import books from "../models/book.model.js";
import users from "../models/user.model.js";

export const getAllBooks = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const search = req.query.search ? req.query.search.trim() : '';

        let query = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const totalBooks = await Book.countDocuments(query);
        const paginatedBooks = await Book.find(query)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            page,
            limit,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            data: paginatedBooks
        });
    } catch (err) {
        next(err);
    }
};

export const getBookByCode = async (req, res, next) => {
    try {
        const bookCode = +req.params.code;
        const foundBook = await Book.findOne({ code: bookCode });

        if (!foundBook) {
            res.status(404);
            return next(new Error('book not found'));
        }
        res.json(foundBook);
    } catch (err) {
        next(err);
    }
};

export const addBook = async (req, res, next) => {
    try {
        const newBook = await Book.create(req.body);
        res.status(201).json({
            massage: 'the book added successfully',
            book: newBook
        });
    } catch (err) {
        next(err);
    }
};

export const updateBook = async (req, res, next) => {
    try {
        const bookCode = +req.params.code;
        const updateBook = await Book.findOneAndUpdate(
            { code: bookCode },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updateBook) {
            res.status(404);
            return next(new Error('book not found'));
        }

        res.json({
            massage: 'the book updated successfully!',
            book: updateBook
        });
    } catch (err) {
        next(err);
    }
};

export const borrowBook = async (req, res, next) => {
    try {
        const bookCode = +req.params.code;
        const { customerCode } = req.body;

        const book = await Book.findOne({ code: bookCode });
        const user = await User.findOne({ code: +customerCode });

        if (!book) {
            res.status(404);
            return next(new Error('book not found'));
        }
        if (!user) {
            res.status(404);
            return next(new Error('user not found'));
        }
        if (book.isBorrowed) {
            res.status(400);
            return next(new Error('book is borrowed now, you can not take it :('));
        }
        if (user.loanBooks && user.loanBooks.length > 0) {
            res.status(400);
            return next(new Error('user already has a borrowed book'));
        }

        book.isBorrowed = true;
        const newLoan = {
            loanDate: new Date().toISOString(),
            customerCode: customerCode
        };
        if (!book.loans) {
            book.loans = [];
        }
        book.loans.push(newLoan);
        await book.save();

        if (!user.loanBooks) {
            user.loanBooks = [];
        }
        user.loanBooks.push(book.code);
        await user.save();

        res.json({
            massage: 'book borrowed successfully!!',
            book,
            user
        });
    } catch (err) {
        next(err);
    }
};

export const returnBook = async (req, res, next) => {
    try {
        const bookCode = +req.params.code;
        const { customerCode } = req.body;

        const book = await Book.findOne({ code: bookCode });

        if (!book) {
            res.status(404);
            return next(new Error('book not found'));
        }
        if (!book.isBorrowed) {
            res.status(400);
            return next(new Error('book is not borrowed now. you cant give it back :('));
        }

        book.isBorrowed = false;

        let user = null;
        if (customerCode) {
            user = await user.findOne({ code: +customerCode });
        } else {
            user = await User.findOne({ loanBooks: bookCode });        }

        if (user && user.loanBooks) {
            user.loanBooks = user.loanBooks.filter(code => code !== bookCode);
            await user.save();
        }

        res.json({
            massage: 'book returned successfully!!',
            book,
            user
        });
    } catch (err) {
        next(err);
    }
};

export const deleteBook = async (req, res, next) => {
    try {
        const bookCode = +req.params.code;
        const deletedBook = await Book.findOneAndDelete({code:bookCode});

        if (!deletedBook) {
            res.status(404);
            return next(new Error('book not found'));
        }

        res.json({
            massage: 'book deleted successfully!',
            book: deletedBook
        });
    } catch (err) {
        next(err);
    }
};