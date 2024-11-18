import { body } from "express-validator";
import TeacherModel from '../models/Teacher.js';

const checkUser = async (teacherId) => {
    console.log(teacherId)
    const isTeacher = await TeacherModel.findById(teacherId);
    console.log(isTeacher)
    if (!isTeacher) {
        throw new Error('No such teacher');
    }
}

export const createWorkTimeValidation = [
    body('day', 'Invalid subject value').isString().isLength({min: 5}),
    body('startTime', 'Invalid startTime value').isString(),
    body('endTime', 'Invalid endTime value').isString(),
    body('teacher').custom(checkUser),
];
