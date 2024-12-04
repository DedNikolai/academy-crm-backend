import { body } from "express-validator";
import TeacherModel from '../models/Teacher.js';

const teacherValidation = async (teachers) => {
    teachers.forEach(async item => {
        const isTeacher = await TeacherModel.findById(item);
        if (!isTeacher) {
            throw new Error('No such teacher');
        }
    })
};

const subjectsValidation = (value) => {
    const subjects = ['Вокал', 'Барабани', 'Фортепіано', 'Гітара'];
    let isValid = true;
    value.forEach(item => {
        if (!subjects.includes(item)) {
            console.log(item)
            isValid = false;
            return
        }
    })
    
    if (!isValid) {
        throw new Error('No such subject');
    }

    return true;
}

const genderValidation = (gender) => {
    const genders = ['Чоловіча', 'Жіноча'];
    if (!genders.includes(gender)) {
        throw new Error('No such gender');
    }

    return true
}

export const studentValidation = [
    body('fullName', 'Invalid fullName value').isString().isLength({min: 5}),
    body('birthday', 'Invalid birthday type').isString().optional(),
    body('parents', 'Invalid birthdday type').isString().optional(),
    body('email', 'Invalid email value').isEmail(),
    body('phone', 'Invalid phone value').isString(),
    body('isActive', 'Ivalid isActiveValue').isBoolean(),
    body('subjects', 'Invalid subjects value').custom(subjectsValidation),
    body('teachers').custom(teacherValidation),
    body('gender', 'Invalid gender value').custom(genderValidation)
];