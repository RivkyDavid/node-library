import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    book: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    },
    borrowDate: { type: Date, default: Date.now },
    returnDate: { type: Date, required: true },
    isReturned: { type: Boolean, default: false }
});

const Loan = mongoose.model('Loan', loanSchema);
export default Loan;