import { body } from "express-validator";
import TeacherModel from '../models/Teacher.js';

const checkUser = async (teacher) => {
    const isTeacher = await TeacherModel.findById(teacher._id);

    if (!isTeacher) {
        throw new Error('No such teacher');
    }
}

export const createWorkTimeValidation = [
    body('day', 'Invalid subject value').isString().isLength({min: 5}),
    body('startTime', 'Invalid startTime value').isDate(),
    body('endTime', 'Invalid endTime value').isDate(),
    body('teacher').custom(checkUser),
];
