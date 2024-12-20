import LessonModel from '../models/Lesson.js';


export default async (req, res, next) => {
    const current = req.body;

    const start = new Date(req.body.date);
    const end = new Date(req.body.date);
    start.setHours(0, 0, 0, 0);
    end.setHours(25, 0, 0, 0);

    const currentStart = new Date(current.date).getTime();
    const currentEnd = currentStart + 60000*current.durationMinutes

    try {
        const lessonsWithCurrentDate = await LessonModel.find({date:{$gt: start, $lt:end}});

        let sameRoomCheck = false

        lessonsWithCurrentDate.filter(lesson => lesson.room == current.room)
            .forEach(lesson => {
                const lessonStart = new Date(lesson.date).getTime();
                const lessonEnd = lessonStart + 60000*lesson.durationMinutes;

                if(currentStart > lessonStart && currentStart < lessonEnd) {
                    sameRoomCheck = true
                    return res.status(403).json({
                        message: 'Зайнятий час в даному кабінеті'
                    })
                }

                if(currentEnd > lessonStart && currentEnd < lessonEnd) {
                    sameRoomCheck = true
                    return res.status(403).json({
                        message: 'Зайнятий час в даному кабінеті'
                    })
                }

                if(currentStart == lessonStart && currentEnd == lessonEnd) {
                    sameRoomCheck = true
                    return res.status(403).json({
                        message: 'Зайнятий час в даному кабінеті'
                    })
                }
            })

        if (!sameRoomCheck) {
            next()
        }    
        
    } catch(error) {
        console.log(error)
        return res.status(403).json({
            message: 'Cant create Lesson'
        })
    }
}

