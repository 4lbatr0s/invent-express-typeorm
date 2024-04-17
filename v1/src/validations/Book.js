import Joi from "joi";

const createValidation = Joi.object({
    name: Joi.string().required().min(3),
    average_rating: Joi.number().integer().min(0).max(10).default(0),
}).unknown(true);

const updateValidation = Joi.object({
    name: Joi.string().min(3),
    average_rating: Joi.number().integer().min(0).max(10),
}).unknown(true);

export default { createValidation, updateValidation };