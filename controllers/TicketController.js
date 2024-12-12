import StudentModel from '../models/Student.js';
import Ticketmodel from '../models/Ticket.js';
import LessonModel from '../models/Lesson.js';

export const createTicket = async (request, response) => {
    try {
        const data = request.body;
        const doc = new Ticketmodel({...data});

        const ticket = await doc.save();
        if (ticket) {
            return response.status(200).json(ticket);
        } else {
            return response.status(400).json({message: 'Cant create ticket'})
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant create ticket'});
    }
};

export const getTickets = async (request, response) => {
    try {
        const {limit = 10, page = 0} = request.query;

        const tickets = await Ticketmodel.paginate({}, {
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
                                            });
    
        return response.status(200).json(tickets);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get tickets'})
    }
};

export const updateTicket = async (request, response) => {
    try {
        const data = request.body;
        const ticketId = request.params.id;

        Ticketmodel.findOneAndUpdate({_id: ticketId}, {...data}, {returnDocument: 'after'})
            .then(result => {
                if (!result) {
                    return response.status(400).json({message: `Ticket ${id} not found`})
                }

                return response.status(200).json({message: "Ticket was updated"});
        }) 
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant update ticket'})
    }
};

export const deleteTicket = async (request, response) => {
    try {
        const id = request.params.id;

        const ticket = await Ticketmodel.findById(id);

        if (!ticket) {
            return response.status(400).json('Ticket not found');
        }

        const lessons = await LessonModel.find({ticket: ticket._id});

        if (lessons.length > 0) {
            return response.status(200).json({message: 'Ticket has lessons'})
        }

        const deletad = await Ticketmodel.deleteOne({_id: id});

        if (deletad) {
            return response.status(200).json({message: 'Ticket was deletad'})
        } else {
            return response.status(400).json('Ticket was not deleted');
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant delete Ticket'})
    }
};

export const getTicketById = async (request, response) => {
    try {
        const id = request.params.id;

        const ticket = await Ticketmodel.findById(id)       
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
                                            }
                                          })
                                          .exec(); 
        if (ticket) {
            return response.status(200).json(ticket);
        } else {
            return response.status(400).json({message: 'ticket not found'});
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get student'})
    }
}

export const getTicketsByStudent = async (request, response) => {
    try {
        const studentId = request.params.id;
        const {limit = 10, page = 0} = request.query;
        const tickets = await Ticketmodel.paginate({student: studentId}, {
                                               page: +page + 1, 
                                               limit: limit,
                                               sort: { createdAt: -1 },
                                               populate:{
                                                path: 'teacher',
                                                select: ['_id', 'fullName', 'subjects']
                                               }  
                                            });


        return response.status(200).json(tickets);

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get tickets'})
    }
}

