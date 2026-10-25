import users from "../DB/usersDb.js";

export const getAllUsers = (req, res, next) => {
    try {
        res.json(users);
    } catch (err) {
        next(err);
    }
};

export const signUp = (req, res, next) => {
    try {
        const { code, userName, email, password } = req.body;

        if (users.some(u => u.code === code || u.email === email)) {
            res.status(400);
            return next(new Error("user is already exist"));
        }

        const newUser = { code, userName, email, password, loanBooks: [] };
        users.push(newUser);

        res.status(201).json({ massage: "user added successfully", newUser });
    } catch (err) {
        next(err);
    }
};

export const signIn = (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = users.find(u => u.email === email && u.password === password);

        if (!user) {
            res.status(401);
            return next(new Error("not valid email or password"));
        }

        res.status(200).json({ massage: "sign-in successfully", user });
    } catch (err) {
        next(err);
    }
};