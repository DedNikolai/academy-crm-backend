import { body } from "express-validator";
import TeacherModel from '../models/Teacher.js';

const teacherValidation = async (teacherId) => {
    const isTeacher = await TeacherModel.findById(teacherId);
    if (!isTeacher) {
        throw new Error('No such teacher');
    }

    return true
};

export const salaryValidation = [
    body('teacher').custom(teacherValidation),
    body('value', 'Invalid Price').isNumeric(),
];