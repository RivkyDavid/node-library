import express from 'express';
import books from './booksDb.js';
import { addCurrentDate, logGetRequestDate, blockOnShabbat } from './middlewares/site.middleware.js';
import mainRouter from './routes/index.route.js'

const app = express();
app.use(express.json());

app.use(addCurrentDate);
app.use(logGetRequestDate);
app.use(blockOnShabbat(12, 22))

app.use('/api', mainRouter);


const port = 5000;

app.get('/', (req, res) => {
    res.send('Hello Everyone 😍')
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});