import { body } from "express-validator";

export const createTeacherValidation = [
    body('fullName', 'Invalid fullName value').isString().isLength({min: 5}),
    body('email', 'Invalid email value').isEmail(),
    body('phone', 'Invalid endTime value').isDate(),
];