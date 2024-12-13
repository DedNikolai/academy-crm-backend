import { body } from "express-validator";
import TeacherModel from '../models/Teacher.js';
import StudentModel from '../models/Student.js';
import TicketModel from '../models/Ticket.js'

const teacherValidation = async (teacherId) => {
    const isTeacher = await TeacherModel.findById(teacherId);
    if (!isTeacher) {
        throw new Error('No such teacher');
    }

    return true
};

const subjectValidation = (value) => {
    const subjects = ['Вокал', 'Барабани', 'Фортепіано', 'Гітара'];
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

const ticketValidation = async (ticketId) => {
    const isTicket = await TicketModel.findById(ticketId);
    
    if (!isTicket) {
        throw new Error('No such ticket');
    }

    return true
}



export const lessonValidation = [
    body('day', 'Invalid day value').isString().isLength({min: 5}),
    body('date', 'Invalid date type').isString(),
    // body('time', 'Invalid date type').isString(),
    body('durationMinutes', 'Invalid duration type').isNumeric(),
    // body('teacher').custom(teacherValidation)
    // body('student').custom(studentValidation),
    body('subject', 'Invalid subject value').custom(subjectValidation),
    body('room', 'Invalid room type').isNumeric(),
    // body('ticket').custom(ticketValidation),
];