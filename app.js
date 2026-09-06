import express from 'express';
import books from './db.js';
const app = express();
app.use(express.json());

const port = 5000;
app.get('/', (req, res) => {
    res.send('Hello Everyone 😍')
})

app.get('/books', (req, res) => {
    res.json(books)
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

app.put('/book/:code',(req,res)=>{
    const bookCode= +req.params.code;
    const book=books.find(b=>b.code===bookCode);

    if(!book){
        return res.status(404).send('book not found');
    }
    if(req.body.name !==undefined){book.name=req.body.name};
    if(req.body.categoty !==undefined){book.categoty=req.body.categoty};
    if(req.body.price !==undefined){book.price=req.body.price};

    res.json({
        massage:'the book updated successfully!',
        book
    });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});