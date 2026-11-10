import Book from "../models/book.model.js";
import User from "../models/user.model.js";

export const getAllBooks = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const search = req.query.search ? req.query.search.trim() : '';

        let query = {};
        if (search) {
            query.title = { $regex: search, $options: 'i' };
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
        const { email } = req.body;

        const book = await Book.findOne({ code: bookCode });
        const user = await User.findOne({ email });

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
        const alreadyBorrowed = user.books.some(b => b.code === book.code);
        if (alreadyBorrowed) {
            res.status(400);
            return next(new Error('you have already borrowed this book'));
        }

        book.isBorrowed = true;
        await book.save();

        if (!user.books) {
            user.books = [];
        }
        user.books.push({ code: book.code, bookName: book.title });
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
        const { email } = req.body;

        const book = await Book.findOne({ code: bookCode });

        if (!book) {
            res.status(404);
            return next(new Error('book not found'));
        }
        if (!book.isBorrowed) {
            res.status(400);
            return next(new Error('book is not borrowed now. you cant give it back :('));
        }

        let user = null;
        if (email) {
            user = await User.findOne({ email });
        } else {
            user = await User.findOne({ "books.code": bookCode });
        }

        book.isBorrowed = false;
        await book.save();

        user.books = user.books.filter(b => b.code !== bookCode);
        await user.save();

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
        const deletedBook = await Book.findOneAndDelete({ code: bookCode });

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

export const getBooksByCategory = async (req, res, next) => {
    try {
        const category = req.params.category;
        const books = await Book.find({ categories: category });

        res.status(200).json({books});
    } catch (err) {
        next(err);
    }
};