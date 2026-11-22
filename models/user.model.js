import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    registrationDate: { type: Date, default: Date.now },
    books: [
        {
            code: { type: Number, required: true },
            bookName: { type: String, required: true },
            returnDate: { type: Date, required: true }
        }
    ]
});

const saltRounds = +process.env.SALT_ROUNDS || 10;
userSchema.pre("save", /update/i, async function () {
    this.password = await bcrypt.hash(this.password, saltRounds)
})

const User = mongoose.model('User', userSchema);

export default User;