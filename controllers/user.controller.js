import users from "../usersDb.js";


export const getAllUsers = (req, res) => {
    res.json(users)
};

export const signUp = (req, res) => {
    const { code, userName, email, password } = req.body;

    if (users.some(u => u.code === code || u.email === email)) {
        return res.status(400).json({ error: "user is already exist" });
    }

    const newUser = { code, userName, email, password, loanBooks: [] };
    users.push(newUser);

    res.status(201).json({ massage: "user addded successfully", newUser });
};

export const signIn =(req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ error: "not valid email or password" });
    }

    res.status(201).json({ massage: "sign-in successfully", user });
};