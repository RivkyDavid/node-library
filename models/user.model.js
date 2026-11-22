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
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) {
    return;
  }

  this.password = await bcrypt.hash(this.password, saltRounds);
});

userSchema.pre(/update/i, async function () {
  const update = this.getUpdate();
  if (!update) {
    return;
  }

  const nextPassword = update.password ?? update.$set?.password;
  if (!nextPassword) {
    return;
  }

  const hashedPassword = await bcrypt.hash(nextPassword, saltRounds);

  if (update.password) {
    update.password = hashedPassword;
  }
  if (update.$set && update.$set.password) {
    update.$set.password = hashedPassword;
  }
});

const User = mongoose.model('User', userSchema);

export default User;