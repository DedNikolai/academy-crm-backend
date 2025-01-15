import TeacherModel from '../models/Teacher.js';
import StudentModel from '../models/Student.js';
import LessonModel from '../models/Lesson.js';
import Ticketmodel from '../models/Ticket.js';

export const createStudent = async (request, response) => {
    try {
        const data = request.body;
        const doc = new StudentModel({...data});

        const student = await doc.save();
        if (student) {
            return response.status(200).json(student);
        } else {
            return response.status(400).json({message: 'Cant create student'})
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant create student'});
    }
};

export const getStudents = async (request, response) => {
    try {
        const {params, limit = 10, page = 0, active} = request.query;
        const isActive = active ? active === 'true' : true
        const regex = new RegExp(params, 'i')
        const students = await StudentModel.paginate({fullName: {$regex: regex}, isActive}, {
                                               page: +page + 1, 
                                               limit: limit,
                                               populate:{
                                                path: 'teachers',
                                                select: ['_id', 'fullName', 'subjects']
                                               }  
                                            });
    
        return response.status(200).json(students);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get students'})
    }
};

export const updateStudent = async (request, response) => {
    try {
        const data = request.body;
        const studentId = request.params.id;

        StudentModel.findOneAndUpdate({_id: studentId}, {...data}, {returnDocument: 'after'})
            .then(result => {
                if (!result) {
                    return response.status(400).json({message: `Student ${id} not found`})
                }

                return response.status(200).json({message: "Student was updated"});
        }) 
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant update student'})
    }
};

export const deleteStudent = async (request, response) => {
    try {
        const id = request.params.id;

        const student = await StudentModel.findById(id);
        const tickets = await Ticketmodel.find({student: student._id});
        const lessons = await LessonModel.find({student: student._id});

        if (tickets.length > 0) {
            return response.status(400).json({message: 'Student has tickets'});
        }

        if (lessons.length > 0) {
            return response.status(400).json({message: 'Student has lessons'});
        }

        if (!student) {
            return response.status(400).json({message: 'Student not found'});
        }

        const deletad = await StudentModel.deleteOne({_id: id});

        if (deletad) {
            return response.status(200).json({message: 'Student was deletad'})
        } else {
            return response.status(400).json({message: 'Student was not deleted'});
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant delete student'})
    }
};

export const getStudentById = async (request, response) => {
    try {
        const id = request.params.id;

        const student = await StudentModel.findById(id)
                                          .populate({
                                            path: 'teachers', 
                                            select: ['_id', 'fullName', 'subjects']
                                          }).exec(); 
        if (student) {
            return response.status(200).json(student);
        } else {
            return response.status(400).json({message: 'Student not found'});
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get student'})
    }
}

export const getStudentsByTeacher = async (request, response) => {
    try {
        const teacherId = request.params.id;
        const {limit = 10, page = 0} = request.query;
        const students = await StudentModel.paginate({teachers: teacherId, isActive: true}, {
                                               page: +page + 1, 
                                               limit: limit,
                                               populate:{
                                                path: 'teachers',
                                                select: ['_id', 'fullName', 'subjects']
                                               }  
                                            });


        return response.status(200).json(students);

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get students'})
    }
}

export const getAllStudents = async (request, response) => {
    try {
        const students = await StudentModel.find({isActive: true})
                                            .select('_id subjects teachers');
    
        return response.status(200).json(students);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get students'})
    }
};

