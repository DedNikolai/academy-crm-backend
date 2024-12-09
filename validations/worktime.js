import { body } from "express-validator";
import TeacherModel from '../models/Teacher.js';

const checkUser = async (teacherId) => {
    const isTeacher = await TeacherModel.findById(teacherId);
    if (!isTeacher) {
        throw new Error('No such teacher');
    }

    return true
}

export const createWorkTimeValidation = [
    body('day', 'Invalid subject value').isString().isLength({min: 5}),
    body('startTime', 'Invalid startTime value').isString(),
    body('endTime', 'Invalid endTime value').isString(),
    body('teacher').custom(checkUser),
];
