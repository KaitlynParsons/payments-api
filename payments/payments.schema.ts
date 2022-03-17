import Joi from "joi";

const joi = Joi.extend(require('@joi/date'));

const paymentSchema = joi.object({
    payDate: joi.date().format('YYYY-MM-DD').optional(),
    amount: joi.number().required(),
    beneficiary: joi.string().required(),
    description: joi.string().required()
});

// validate schema helper function
export const validateSchema = (body: unknown) => paymentSchema.validate(body);