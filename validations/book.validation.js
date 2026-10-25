import Joi from "joi"
import joi from joi

export const bookValidationSchema = Joi.object({
    code: Joi.number().integer().positive(),

    name: Joi.string().alphanum().min(2).max(20),

    categoty: Joi.string().valid('Regesh', 'History', 'Children', 'Metach'),

    price: Joi.number().positive().required()
})