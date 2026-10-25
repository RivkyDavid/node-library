import joi from joi

export const userValidationSchema = Joi.object({
    userName: Joi.string().alphanum().min(3).max(30),

    email: Joi.string().email({ tlds: { allow: ['com', 'co.il', 'org'] } }),

    password: Joi.string().
        min(8).
        pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')).
        required()
})