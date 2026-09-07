import express from 'express';
import books from './db.js';
const app = express();
app.use(express.json());

const port = 5000;
app.get('/', (req, res) => {
    res.send('Hello Everyone 😍')
})

app.get('/books', (req, res) => {    
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
    /*res.json(books)*/
});

app.get('/books/:code', (req, res) => {
    const bookCode = +req.params.code;
    const foundBook = books.find(b => b.code === bookCode);

    if (!foundBook) {
        return res.status(404).send('book not found');
    }
    res.json(foundBook);
});

app.post('/book', (req, res) => {
    const newBook = req.body;
    books.push(newBook);
    res.status(201).json({
        massage: 'the book addad successfully',
        book: newBook
    });
})

app.put('/book/:code', (req, res) => {
    const bookCode = +req.params.code;
    const book = books.find(b => b.code === bookCode);

    if (!book) {
        return res.status(404).send('book not found');
    }
    if (req.body.name !== undefined) { book.name = req.body.name };
    if (req.body.categoty !== undefined) { book.categoty = req.body.categoty };
    if (req.body.price !== undefined) { book.price = req.body.price };

    res.json({
        massage: 'the book updated successfully!',
        book
    });

});

app.post('/book/:code/borrow', (req, res) => {
    const bookCode = +req.params.code;
    const { customerCode } = req.body;

    const book = books.find(b => b.code === bookCode);

    if (!book) {
        return res.status(404).send('book not found');
    }
    if (book.isBorrowed) {
        return res.status(400).send('book is borrowed now, you can not take it :(');
    }

    book.isBorrowed = true;
    const newLoan = {
        loanDate: new Date().toISOString(),
        customerCode: customerCode
    }
    book.loans.push(newLoan);

    res.json({
        massage: 'book borrowed successfully!!',
        book
    })
});

app.post('/book/:code/back', (req, res) => {
    const bookCode = +req.params.code;

    const book = books.find(b => b.code === bookCode);

    if (!book) {
        return res.status(404).send('book not found');
    }
    if (!book.isBorrowed) {
        return res.status(400).send('book is not borrowed now. you cant give it back :(');
    }

    book.isBorrowed = false;

    res.json({
        massage: 'book borrowed successfully!!',
        book
    })
});

app.delete('/book/:code', (req, res) => {
    const bookCode=+req.params.code;
    const index=books.findIndex(b=>b.code===bookCode);

    if(index===-1){
        return res.status(404).send('book not found')
    }

    const [deletedBook]=books.splice(index,1);
    res.json({
        massage:'book deleted successfully!',
        book:deletedBook
    });
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});