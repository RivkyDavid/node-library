import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    price: { type: Number, required: true },
    categories: { type: [String], required: true },
    author: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        email: { type: String, required: true }
    }
});

const Book = mongoose.model('Book', bookSchema);

export default Book;