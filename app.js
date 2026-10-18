import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import express from 'express';

import books from './booksDb.js';
import { addCurrentDate, logGetRequestDate, blockOnShabbat } from './middlewares/site.middleware.js';
import {notFoundHundler,globalErrorHandler} from './middlewares/error.middleware.js'
import mainRouter from './routes/index.route.js'


const app = express();

// CORS- מאפשר גישה מכל פרויקט קליינט בלי להתקל בבעיות חסימה 
app.use(cors());

//Morgan - מדפיס את נתוני כל בקשה שמגיעה לשרת במצב פיתוח
app.use(morgan('dev'));

//Helmet -מאובטחת HTTP משפר את אבטחת השרת על ידי הוספה ועדכון של כותרות
app.use(helmet());

//Rate Limit -יכולה לבצע כדי למנוע עומסים והתקפות IP מגביל את מספר הבקשות שכתובת 
const limiter =rateLimit ({
    windowMs: 15*60*1000,
    max:100
});
app.use(limiter);

app.use(express.json());
app.use(addCurrentDate);
app.use(logGetRequestDate);
app.use(blockOnShabbat(12, 22))
app.use('/api', mainRouter);



app.get('/', (req, res) => {
    res.send('Hello Everyone 😍')
})

app.use(globalErrorHandler);
app.use(notFoundHundler);

const PORT = process.env.PORT ?? 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});