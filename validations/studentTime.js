import { body } from "express-validator";


export const createTimeValidation = [
    body('day', 'Invalid subject value').isString().isLength({min: 5}),
    body('startTime', 'Invalid startTime value').isString(),
    body('duration', 'Invalid endTime value').isNumeric(),
];
