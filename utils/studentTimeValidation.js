import StudentTimeModel from '../models/StudentTime.js';
import TeacherModel from '../models/Teacher.js';

export default async (req, res, next) => {
    const {day, teacher} = req.body
    try {
        const lessons = await StudentTimeModel.find({day, teacher});
        const teacherFromDb = await TeacherModel.findById(teacher)
                                                  .populate({
                                                    path: 'worktimes',
                                                    select: ['day', 'startTime', 'endTime']
                                                  }).exec();

        let workTimeCheck = teacherWorkTimeCheck(req.body, teacherFromDb);  
        let teacherCheck = teacherTimeCheck(lessons, req.body);                                        
        
        if (!workTimeCheck && !teacherCheck) {
            next()
        } else {

            if (workTimeCheck) {
                return res.status(403).json({
                    message: 'Не робочий час в даного вчителя'
                })
            }

            if (teacherCheck) {
                return res.status(403).json({
                    message: 'Зайнятий час в даного вчителя'
                })
            }
        }
    } catch(error) {
        console.log(error)
        return res.status(403).json({
            message: 'Cant create StudentLesson'
        })
    }
}

function teacherWorkTimeCheck(current, teacher) {
    let result = true
    const currentStart = new Date(current.startTime).getHours()*60 + new Date(current.startTime).getMinutes();
    const currentEnd = currentStart + current.duration;

    const workDays = teacher.worktimes.filter(worktime => worktime.day === current.day);

    if (workDays.length === 0) {
        return true;
    }

    workDays.forEach(workDay => {
        const workDayStart = new Date(workDay.startTime).getHours()*60 + new Date(workDay.startTime).getMinutes();
        const workDayEnd = new Date(workDay.endTime).getHours()*60 + new Date(workDay.endTime).getMinutes();


        if (currentStart >= workDayStart && currentEnd <= workDayEnd) {
            result = false
            return
        }

    })

    return result

}

function teacherTimeCheck(lessons, current) {
    let result = false
    const currentStart = new Date(current.startTime).getHours()*60 + new Date(current.startTime).getMinutes();
    const currentEnd = currentStart + current.duration;

    lessons.forEach(lesson => {
        const lessonStart = new Date(lesson.startTime).getHours()*60 + new Date(lesson.startTime).getMinutes();
        const lessonEnd = new Date(lesson.endTime).getHours()*60 + new Date(lesson.endTime).getMinutes();
    

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

    return result

}


