import books from "../booksDb.js";
import users from "../usersDb.js";

export const getAllBooks = (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 10);
        const search = req.query.search ? req.query.search.trim() : '';

        let filteredBooks = books;
        if (search) {
            filteredBooks = books.filter(b =>
                b.name.toLowerCase().includes(search.toLowerCase())
            );
        }

        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedBooks = filteredBooks.slice(startIndex, endIndex);

        res.json({
            page,
            limit,
            totalBooks: filteredBooks.length,
            totalPages: Math.ceil(filteredBooks.length / limit),
            data: paginatedBooks
        });
    } catch (err) {
        next(err);
    }
};

export const getBookByCode = (req, res, next) => {
    try {
        const bookCode = +req.params.code;
        const foundBook = books.find(b => b.code === bookCode);

        if (!foundBook) {
            res.status(404);
            return next(new Error('book not found'));
        }
        res.json(foundBook);
    } catch (err) {
        next(err);
    }
};

export const addBook = (req, res, next) => {
    try {
        const newBook = req.body;
        books.push(newBook);
        res.status(201).json({
            massage: 'the book added successfully',
            book: newBook
        });
    } catch (err) {
        next(err);
    }
};

export const updateBook = (req, res, next) => {
    try {
        const bookCode = +req.params.code;
        const book = books.find(b => b.code === bookCode);

        if (!book) {
            res.status(404);
            return next(new Error('book not found'));
        }
        if (req.body.name !== undefined) { book.name = req.body.name; }
        if (req.body.categoty !== undefined) { book.categoty = req.body.categoty; }
        if (req.body.price !== undefined) { book.price = req.body.price; }

        res.json({
            massage: 'the book updated successfully!',
            book
        });
    } catch (err) {
        next(err);
    }
};

export const borrowBook = (req, res, next) => {
    try {
        const bookCode = +req.params.code;
        const { customerCode } = req.body;

        const book = books.find(b => b.code === bookCode);
        const user = users.find(u => u.code === +customerCode);

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

        if (!user.loanBooks) {
            user.loanBooks = [];
        }
        user.loanBooks.push(book.code);

        res.json({
            massage: 'book borrowed successfully!!',
            book,
            user
        });
    } catch (err) {
        next(err);
    }
};

export const returnBook = (req, res, next) => {
    try {
        const bookCode = +req.params.code;
        const { customerCode } = req.body;

        const book = books.find(b => b.code === bookCode);

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
            user = users.find(u => u.code === +customerCode);
        } else {
            user = users.find(u => u.loanBooks && u.loanBooks.includes(bookCode));
        }

        if (user && user.loanBooks) {
            user.loanBooks = user.loanBooks.filter(code => code !== bookCode);
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

export const deleteBook = (req, res, next) => {
    try {
        const bookCode = +req.params.code;
        const index = books.findIndex(b => b.code === bookCode);

        if (index === -1) {
            res.status(404);
            return next(new Error('book not found'));
        }

        const [deletedBook] = books.splice(index, 1);
        res.json({
            massage: 'book deleted successfully!',
            book: deletedBook
        });
    } catch (err) {
        next(err);
    }
};