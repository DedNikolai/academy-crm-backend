import { body } from "express-validator";

export const createTeacherValidation = [
    body('fullName', 'Invalid fullName value').isString().isLength({min: 5}),
    body('email', 'Invalid email value').isEmail(),
    body('phone', 'Invalid phone value').isString(),
    body('birthday', 'Invalid birthdday type').isString().optional(),
    body('age', "Invalid age").isNumeric().optional(),
    body('isActive', 'Ivalid isActiveValue').isBoolean(),
];