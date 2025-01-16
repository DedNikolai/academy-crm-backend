import { body } from "express-validator";
import TeacherModel from '../models/Teacher.js';
import StudentModel from '../models/Student.js';

const teacherValidation = async (teacherId) => {
    const isTeacher = await TeacherModel.findById(teacherId);
    if (!isTeacher) {
        throw new Error('No such teacher');
    }

    return true
};

const subjectValidation = (value) => {
    const subjects = ['VOCAL', 'DRUMS', 'PIANO', 'GUITAR'];
    if (!subjects.includes(value)) {
        throw new Error('No such subject');
    }

    return true;

}

const studentValidation = async (studentId) => {
    const isStudent = await StudentModel.findById(studentId);
    
    if (!isStudent) {
        throw new Error('No such student');
    }

    return true
}

const payTypeValidation = (payType, {req}) => {
    if (req.body.isPaid && !payType) {
        throw new Error('Вкажіть тип оплати');
    }

    return true;
}

export const ticketValidation = [
    body('title', 'Invalid title value').isString().isLength({min: 3}),
    body('startDate', 'Invalid startDate type').isString(),
    body('endDate', 'Invalid endDate type').isString(),
    body('student').custom(studentValidation),
    body('subject', 'Invalid subject value').custom(subjectValidation),
    body('teacher').custom(teacherValidation),
    body('price', 'Invalid Price').isNumeric(),
    body('generalAmount', 'Invalid generalAmount').isNumeric(),
    body('payType', 'Invalid Paytype').custom(payTypeValidation),
];