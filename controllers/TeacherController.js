import { response } from 'express';
import TeacherModel from '../models/Teacher.js';

export const createTeacher = async (request, response) => {
    try {
        const data = request.body;
        const doc = new TeacherModel({...data});

        const teacher = await doc.save();

        if (teacher) {
            return response.status(200).json(teacher);
        } else {
            return response.status(400).json({message: 'Cant create teacher'})
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant create teacher'});
    }
};

export const getTeachers = async (request, response) => {
    try {
        const teachers = await TeacherModel.find({}).populate({path: 'subjects'}).exec();
        response.status(200).json(teachers);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cantget teachers'})
    }
};