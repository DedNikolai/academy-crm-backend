import { body } from "express-validator";

export const payAccountValidation = [
    body('title', 'Invalid title value').isString().isLength({min: 3}),
    body('value', 'Invalid value').isNumeric(),
];
