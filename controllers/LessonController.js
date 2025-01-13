import StudentModel from '../models/Student.js';
import Ticketmodel from '../models/Ticket.js';
import LessonModel from '../models/Lesson.js';
import {LessonStatus} from '../constants/lesson-status.js';
import TeacherModel from '../models/Teacher.js';

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
        const {limit = 10, page = 0, date = ''} = request.query;
        const start = new Date(date);
        const end = new Date(date);
        end.setHours(25);
        const params = date ? {date: {$gt: start, $lt:end}} : {};
        const sortParams = date ? { createdAt: -1 } : {date: -1}
        const lessons = await LessonModel.paginate(params, {
                                               page: +page + 1, 
                                               limit: limit,
                                               sort: sortParams,
                                               populate: [
                                                    {
                                                        path: 'teacher',
                                                        select: ['_id', 'fullName', 'subjects']
                                                    },
                                                    {
                                                        path: 'student',
                                                        select: ['_id', 'fullName']
                                                    },
                                                    {
                                                        path: 'ticket',
                                                        select: ['_id', 'startDate', 'endDate', 'price', 'generalAmount', 'isPaid'],
                                                        populate: {
                                                            path: 'lessons',
                                                            select: ['_id', 'status']
                                                        }
                                                    }, 
                                               ]
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
        const lessonFromBD = await LessonModel.findById(lessonId);

        const ticket = await Ticketmodel.findOne({_id: data.ticket})
                                        .populate({
                                            path: 'lessons',
                                            select: ['_id', 'status']
                                        });
        
        if (ticket) {

            if (data.status === LessonStatus.TRANSFERED) {
                const transferredAmount = ticket.lessons.filter(lesson => lesson.status === LessonStatus.TRANSFERED).length;
                
                const lessonFromBD = ticket.lessons.find(lesson => lesson._id.toString() === data._id);
                
                if (ticket.generalAmount/4 === transferredAmount && lessonFromBD.status !== LessonStatus.TRANSFERED ) {
                    return response.status(400).json({message: 'Limit of transfered lessons qauntity'})
                }
            }

            if (data.status !== LessonStatus.TRANSFERED) {
                const activedAmount = ticket.lessons.filter(lesson => lesson.status !== LessonStatus.TRANSFERED).length;
                
                const lessonFromBD = ticket.lessons.find(lesson => lesson._id.toString() === data._id);

                if (activedAmount >= ticket.generalAmount && lessonFromBD.status === LessonStatus.TRANSFERED ) {
                    return response.status(400).json({message: 'Limit of transfered lessons qauntity'})
                }
            }


        } else {
            return response.status(400).json({message: 'No such ticket'})
        }

        LessonModel.findOneAndUpdate({_id: lessonId}, {...data}, {returnDocument: 'after'})
            .then(async result => {
                if (!result) {
                    return response.status(400).json({message: `Lesson ${lessonId} not found`})
                }

                if (result.payout !== lessonFromBD.payout) {

                }

                return response.status(200).json(result);
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

        if (lesson.payout) {
            return response.status(400).json('Не можна видалити урок по якому є виплата викладачу');
        }

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
                                                select: ['_id', 'startDate', 'endDate', 'price', 'generalAmount', 'usedAmount', 'transferred', 'isPaid']
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
                                               populate: [
                                                        {
                                                            path: 'teacher',
                                                            select: ['_id', 'fullName', 'subjects']
                                                        },
                                                        {
                                                            path: 'student',
                                                            select: ['_id', 'fullName']
                                                        },
                                                        {
                                                            path: 'ticket',
                                                            select: ['_id', 'startDate', 'endDate', 'price', 'generalAmount', 'isPaid'],
                                                            populate: {
                                                                path: 'lessons',
                                                                select: ['_id', 'status']
                                                            }
                                                        }, 
                                                ]
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

export const getLessonsByWeek = async (request, response) => {
    try {
        const date = request.params.date;
        const currentDate = new Date(date);
        const week = Array(7).fill(currentDate).map((el, idx) =>
            new Date(el.setDate(el.getDate() - el.getDay() + idx + 1)))
        const start = week[0];
        const end = week[6];
        start.setHours(0, 0, 0 ,0);
        end.setHours(25);
        const lessons = await LessonModel.find({date:{$gt: start, $lt:end}})
                                            .populate({
                                                path: 'teacher', 
                                                select: ['_id', 'fullName', 'subjects']
                                            })
                                            .populate({
                                                path: 'student', 
                                                select: ['_id', 'fullName', 'subjects'],
                                            })
                                            .populate({
                                                path: 'ticket', 
                                                select: ['_id', 'isPaid'],
                                            })
                                            .exec(); 
    
        return response.status(200).json(lessons);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get lessons'})
    }
};

export const updatePayuot  = async (request, response) => {
    const data = request.body;
    const lessonId = request.params.id;
    try {
        LessonModel.findOneAndUpdate({_id: lessonId}, {payout: data.payout}, {returnDocument: 'after'})
            .then(async result => {
                if (!result) {
                    return response.status(400).json({message: `Lesson ${lessonId} not found`})
                }

                if (result.payout !== lessonFromBD.payout) {

                }

                return response.status(200).json(result);
        }) 
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get update'})
    }
}

