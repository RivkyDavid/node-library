import Joi from "joi";

export const userValidationSchema = Joi.object({
    name: Joi.string().min(2).required(),

    email: Joi.string().email().lowercase().required(),
    phone: Joi.string().pattern(/^05\d-?\d{7}$/).required(),
    password: Joi.string().min(4).required(),

    registrationDate: Joi.date().default(Date.now),

    books: Joi.array().items(
        Joi.object({
            code: Joi.number().integer().required(),
            bookName: Joi.string().required()
        })
    )
});