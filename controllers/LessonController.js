import StudentModel from '../models/Student.js';
import Ticketmodel from '../models/Ticket.js';
import LessonModel from '../models/Lesson.js';
import {LessonStatus} from '../constants/lesson-status.js';

export const createLesson = async (request, response) => {
    try {
        const data = request.body;
        const doc = new LessonModel({...data});

        const ticket = await Ticketmodel.findOne({_id: data.ticket})
                                        .populate({
                                            path: 'lessons',
                                            select: ['_id', 'status']
                                        });
        
        if (ticket) {
            const activeLessons = ticket.lessons.filter(lesson => lesson.status !== LessonStatus.TRANSFERED).length;
            if (ticket.generalAmount === activeLessons ) {
                return response.status(400).json({message: 'Limit of lessons qauntity'})
            }
        } else {
            return response.status(400).json({message: 'No such ticket'})
        }
        
        const lesson = await doc.save();
        if (lesson) {
            ticket.lessons.push(lesson._id);
            await ticket.save();
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
        const ticket = await Ticketmodel.findById(lesson.ticket);
        ticket.lessons.pull(lesson._id);

        if (!lesson) {
            return response.status(400).json('Lesson not found');
        }

        const deletad = await LessonModel.deleteOne({_id: id});

        if (deletad) {
            await ticket.save();
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

export const getLessonsByTicket = async (request, response) => {
    try {
        const ticketId = request.params.id;
        const lessons = await LessonModel.find({ticket: ticketId})
                                          .populate({
                                            path: 'ticket',
                                            select: ['_id', 'startDate', 'endDate', 'price', 'generalAmount', 'usedAmount', 'transferred']
                                          })
                                          .populate({
                                            path: 'teacher',
                                            select: ['_id', 'fullName', 'subjects'],
                                          }).sort({date: 1}).exec();


        return response.status(200).json(lessons);

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get lessons'})
    }
}

