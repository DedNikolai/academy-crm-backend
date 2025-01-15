import TeacherModel from '../models/Teacher.js';
import WorkTimeModel from '../models/WorkTime.js';
import StudentModel from '../models/Student.js';
import LessonModel from '../models/Lesson.js';

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
        const teachers = await TeacherModel.find({})
                                .populate({
                                    path: 'worktimes', 
                                    select: ['_id', 'day', 'startTime', 'endTime', 'teacher'],
                                    options: {sort: {sortOrder: 1}}
                                }).exec();
        response.status(200).json(teachers);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cantget teachers'})
    }
};

export const updateTeacher = async (request, response) => {
    try {
        const data = request.body;
        const teacherId = request.params.id;

        TeacherModel.findOneAndUpdate({_id: teacherId}, {...data}, {returnDocument: 'after'})
            .then(result => {
                if (!result) {
                    return response.status(400).json({message: `Teacher ${id} not found`})
                }

                return response.status(200).json({message: "Teacher was updated"});
        }) 
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant update teacher'})
    }
};

export const deleteTeacher = async (request, response) => {
    try {
        const id = request.params.id;

        const teacher = await TeacherModel.findById(id);

        const students = await StudentModel.find({teachers: teacher._id});
        const lessons = await LessonModel.find({teacher: teacher._id})

        if (students.length > 0) {
            return response.status(400).json({message: 'Teacher has students'});
        }

        if (!teacher) {
            return response.status(400).json('Teacher not found');
        }

        const deletad = await TeacherModel.deleteOne({_id: id});

        if (deletad) {
            await WorkTimeModel.deleteMany({teacher: id})
            return response.status(200).json({message: 'Teacher was deletad'})
        } else {
            return response.status(400).json('Teacher was not deleted');
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant delete teacher'})
    }
};

export const getTeacherById = async (request, response) => {
    try {
        const id = request.params.id;

        const teacher = await TeacherModel.findById(id)
                                .populate({
                                    path: 'worktimes', 
                                    select: ['_id', 'day', 'startTime', 'endTime', 'teacher'],
                                    options: {sort: {sortOrder: 1}}
                                }).exec();;

        if (teacher) {
            return response.status(200).json(teacher);
        } else {
            return response.status(400).json({message: 'Teahcer not found'});
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get teacher'})
    }
}

