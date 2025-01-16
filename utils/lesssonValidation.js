import LessonModel from '../models/Lesson.js';
import TeacherModel from '../models/Teacher.js';
import TicketModel from '../models/Ticket.js';


export default async (req, res, next) => {
    const current = req.body;

    const start = new Date(req.body.date);
    const end = new Date(req.body.date);
    start.setHours(0, 0, 0, 0);
    end.setHours(25, 0, 0, 0);

    try {
        const lessonsWithCurrentDate = await LessonModel.find({date:{$gt: start, $lt:end}, '_id': {$ne: current._id}});
        const teacher = await TeacherModel.findById(current.teacher)
                                          .populate({
                                            path: 'worktimes',
                                            select: ['day', 'startTime', 'endTime']
                                          }).exec();

        let ticket

        if (current.ticket) {
            ticket = await TicketModel.findById(current.ticket);
        }                                                                        

        let sameRoomCheck = roomCheck(lessonsWithCurrentDate, current);
        let teacherCheck = teacherTimeCheck(lessonsWithCurrentDate, current);
        let workTimeCheck = teacherWorkTimeCheck(current, teacher);
        let ticketCheck = current.ticket ? ticketExpireCheck(current, ticket) : false;

        if (!sameRoomCheck && !teacherCheck && !workTimeCheck && !ticketCheck) {
            next()
        } else {
            if (sameRoomCheck) {
                return res.status(403).json({
                    message: 'Зайнятий час в даному кабінеті'
                })
            }

            if (teacherCheck) {
                return res.status(403).json({
                    message: 'Зайнятий час в даного вчителя'
                })
            }

            if (workTimeCheck) {
                return res.status(403).json({
                    message: 'Не робочий час в даного вчителя'
                })
            }

            if (ticketCheck) {
                return res.status(403).json({
                    message: 'Дата заняття не відповідає терміну дії абонемента'
                })
            }

        }
        
        
    } catch(error) {
        console.log(error)
        return res.status(403).json({
            message: 'Cant create Lesson'
        })
    }
}


function roomCheck(lessonsWithCurrentDate, current) {
    const currentStart = new Date(current.date).getTime();
    const currentEnd = currentStart + 60000*current.durationMinutes;
    let result = false

    lessonsWithCurrentDate.filter(lesson => lesson.room == current.room)
    .forEach(lesson => {
        const lessonStart = new Date(lesson.date).getTime();
        const lessonEnd = lessonStart + 60000*lesson.durationMinutes;

        if(currentStart > lessonStart && currentStart < lessonEnd) {
            result = true
        }

        if(currentEnd > lessonStart && currentEnd < lessonEnd) {
            result = true
        }

        if(currentStart == lessonStart && currentEnd == lessonEnd) {
            result = true
        }
    })

    return result;
}


function teacherTimeCheck(lessonsWithCurrentDate, current) {
    const currentStart = new Date(current.date).getTime();
    const currentEnd = currentStart + 60000*current.durationMinutes;
    let result = false

    lessonsWithCurrentDate.filter(lesson => lesson.teacher == current.teacher)
    .forEach(lesson => {
        const lessonStart = new Date(lesson.date).getTime();
        const lessonEnd = lessonStart + 60000*lesson.durationMinutes;

        if(currentStart > lessonStart && currentStart < lessonEnd) {
            result = true
        }

        if(currentEnd > lessonStart && currentEnd < lessonEnd) {
            result = true
        }

        if(currentStart == lessonStart && currentEnd == lessonEnd) {
            result = true
        }
    })

    return result;
}

function teacherWorkTimeCheck(current, teacher) {
    let result = true
    const workDays = teacher.worktimes.filter(worktime => worktime.day === current.day);

    if (workDays.length === 0) {
        return true;
    }

    workDays.forEach(workDay => {
        const workDayStart = new Date(workDay.startTime).getHours()*60 + new Date(workDay.startTime).getMinutes();
        const workDayEnd = new Date(workDay.endTime).getHours()*60 + new Date(workDay.endTime).getMinutes();
        const currentStart = new Date(current.date).getHours()*60 + new Date(current.date).getMinutes();
        const currentEnd = currentStart + current.durationMinutes;

        if (currentStart >= workDayStart && currentEnd <= workDayEnd) {
            result = false
            return
        }

    })

    return result

}

function ticketExpireCheck(current, ticket) {
    const currentDate = new Date(current.date).setHours(0, 0, 0, 0);
    const ticketStart = new Date(ticket.startDate).setHours(0, 0, 0, 0);
    const ticketEnd = new Date(ticket.endDate).setHours(0, 0, 0, 0);

    if (currentDate < ticketStart || currentDate > ticketEnd) {
        return true
    }

    return false;
}

