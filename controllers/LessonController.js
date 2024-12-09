import StudentModel from '../models/Student.js';
import Ticketmodel from '../models/Ticket.js';
import LessonModel from '../models/Lesson.js';

export const createLesson = async (request, response) => {
    try {
        const data = request.body;
        const doc = new LessonModel({...data});

        const lesson = await doc.save();
        if (lesson) {
            return response.status(200).json(lesson);
        } else {
            return response.status(400).json({message: 'Cant create lesson'})
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant create lesson'});
    }
};

export const getLessons = async (request, response) => {
    try {
        const {limit = 10, page = 0} = request.query;

        const lessons = await LessonModel.paginate({}, {
                                               page: +page + 1, 
                                               limit: limit,
                                               sort: { createdAt: -1 },
                                               populate:{
                                                path: 'teacher',
                                                select: ['_id', 'fullName', 'subjects']
                                               },
                                               populate:{
                                                path: 'student',
                                                select: ['_id', 'fullName']
                                               },
                                               populate:{
                                                path: 'tіcket',
                                                select: ['_id', 'startDate', 'endDate', 'price', 'generalAmount', 'usedAmount', 'transferred']
                                               },   
                                            });
    
        return response.status(200).json(lessons);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get lessons'})
    }
};

export const updateLesson = async (request, response) => {
    try {
        const data = request.body;
        const lessonId = request.params.id;

        LessonModel.findOneAndUpdate({_id: lessonId}, {...data}, {returnDocument: 'after'})
            .then(result => {
                if (!result) {
                    return response.status(400).json({message: `Lesson ${lessonId} not found`})
                }

                return response.status(200).json({message: "Lessons was updated"});
        }) 
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant update lesson'})
    }
};

export const deleteLesson = async (request, response) => {
    try {
        const id = request.params.id;

        const lesson = await LessonModel.findById(id);

        if (!lesson) {
            return response.status(400).json('Lesson not found');
        }

        const deletad = await LessonModel.deleteOne({_id: id});

        if (deletad) {
            return response.status(200).json({message: 'Lesson was deletad'})
        } else {
            return response.status(400).json('Lesson was not deleted');
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant delete Lesson'})
    }
};

export const getLessonById = async (request, response) => {
    try {
        const id = request.params.id;

        const lesson = await LessonModel.findById(id)       
                                          .populate({
                                            path: 'teacher', 
                                            select: ['_id', 'fullName', 'subjects']
                                          })
                                          .populate({
                                            path: 'student', 
                                            select: ['_id', 'fullName', 'teachers', 'subjects'],
                                            populate: {
                                                path: 'teachers',
                                                select: ['_id', 'fullName', 'subjects']
                                            },
                                            populate:{
                                                path: 'tіcket',
                                                select: ['_id', 'startDate', 'endDate', 'price', 'generalAmount', 'usedAmount', 'transferred']
                                               },   
                                          })
                                          .exec(); 
        if (lesson) {
            return response.status(200).json(lesson);
        } else {
            return response.status(400).json({message: 'Lesson not found'});
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get lesson'})
    }
}

export const getLessonsByStudent = async (request, response) => {
    try {
        const studentId = request.params.id;
        const {limit = 10, page = 0} = request.query;
        const lessons = await LessonModel.paginate({student: studentId}, {
                                               page: +page + 1, 
                                               limit: limit,
                                               sort: { createdAt: -1 },
                                               populate:{
                                                path: 'teacher',
                                                select: ['_id', 'fullName', 'subjects']
                                               },
                                               populate:{
                                                path: 'tіcket',
                                                select: ['_id', 'startDate', 'endDate', 'price', 'generalAmount', 'usedAmount', 'transferred']
                                               },     
                                            });


        return response.status(200).json(lessons);

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get lessons'})
    }
}

