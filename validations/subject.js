import { body } from "express-validator";

export const createSubjectValidation = [
    body('value', 'Invalid subject value').isString().isLength({min: 2}),
];