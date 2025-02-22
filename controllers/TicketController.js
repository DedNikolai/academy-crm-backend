import Ticketmodel from '../models/Ticket.js';
import LessonModel from '../models/Lesson.js';
import PayAccountModel from '../models/PayAccount.js';

export const createTicket = async (request, response) => {
    try {
        const data = request.body;
        const payType = data.payType || null

        const doc = new Ticketmodel({...data, payType});
    
        const ticket = await doc.save();
        if (ticket) {
            if (ticket.isPaid) {
                const payType = ticket.payType;
                await PayAccountModel.findOneAndUpdate({_id: payType}, {
                    $inc: {
                    value: ticket.price
                  }}, {returnDocument: 'after'})
            }
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
                                               populate:[{
                                                path: 'teacher',
                                                select: ['_id', 'fullName', 'subjects']
                                               },
                                               {
                                                path: 'student',
                                                select: ['_id', 'fullName']
                                               },
                                               {
                                                path: 'payType',
                                                select: ['_id', 'title']
                                               },
                                               {
                                                path: 'lessons',
                                                select: ['_id', 'status']
                                               }]   
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
        const payType = data.payType || null
        const ticketId = request.params.id;

        const ticketFromDb = await Ticketmodel.findById(ticketId)

        Ticketmodel.findOneAndUpdate({_id: ticketId}, {...data, payType}, {returnDocument: 'after'})
            .then(async result => {
                if (!result) {
                    return response.status(400).json({message: `Ticket ${id} not found`})
                }
                if (ticketFromDb.isPaid !== result.isPaid) {
                    
                    if (result.isPaid) {
                        await PayAccountModel.findOneAndUpdate({_id: result.payType}, {
                            $inc: {
                            value: result.price
                          }}, {returnDocument: 'after'})
                    } else {
                        await PayAccountModel.findOneAndUpdate({_id: ticketFromDb.payType}, {
                            $inc: {
                            value: -result.price
                          }}, {returnDocument: 'after'})
                    }
                } else {
                    if (result.isPaid && result.payType !== ticketFromDb.payType) {
                        await PayAccountModel.findOneAndUpdate({_id: result.payType}, {
                            $inc: {
                            value: result.price
                          }}, {returnDocument: 'after'});
                          await PayAccountModel.findOneAndUpdate({_id: ticketFromDb.payType}, {
                            $inc: {
                            value: -result.price
                          }}, {returnDocument: 'after'})
                    }
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

        if (ticket.isPaid) {
            return response.status(400).json({message: 'Не можна видалити оплачений абонемент'});
        }

        if (!ticket) {
            return response.status(400).json('Ticket not found');
        }

        const lessons = await LessonModel.find({ticket: ticket._id});

        if (lessons.length > 0) {
            return response.status(400).json({message: 'Ticket has lessons'})
        }

        const deletad = await Ticketmodel.deleteOne({_id: id});

        if (deletad) {
            return response.status(200).json(ticket)
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
                                            path: 'lessons', 
                                            select: ['_id', 'status', 'day', 'date', 'durationMinutes', 'room']
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
                                               populate:[{
                                                path: 'teacher',
                                                select: ['_id', 'fullName', 'subjects']
                                               },
                                               {
                                                path: 'student',
                                                select: ['_id', 'fullName']
                                               },
                                               {
                                                path: 'lessons',
                                                select: ['_id', 'status']
                                               }]   
                                            });


        return response.status(200).json(tickets);

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get tickets'})
    }
}

export const getTicketsSubjectStats = async (request, response) => {
    try {

        const tickets = await Ticketmodel.find({}).select('_id price subject');
    
        return response.status(200).json(tickets);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get tickets'})
    }
};

