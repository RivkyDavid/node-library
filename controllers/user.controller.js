import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    }
    catch (error) {
        next(error)
    }
};

export const signUp = async (req, res, next) => {
    try {
        const { code, userName, email, password } = req.body;
        const existUser = await User.findOne({ email });

        if (existUser) {
            res.status(404);
            return next(new Error("user is already exist"))
        }

        const newUser = new User({ name, email, phone, password, books: [] });
        await newUser.save();

        res.status(201).json({ massage: "user added successfully", newUser });
    } catch (err) {
        next(err);
    }
};

export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            res.status(401);
            return next(new Error("not valid email or password"));
        }

        if (password !== user.password) {
            res.status(401);
            return next(new Error("not valid email or password"));
        }

        res.status(200).json({ massage: "sign-in successfully", user });
    } catch (err) {
        next(err);
    }
};