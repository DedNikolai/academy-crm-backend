import { body } from "express-validator";

export const createRoleValidation = [
    body('value', 'Invalid role value').isString().isLength({min: 2}),
];