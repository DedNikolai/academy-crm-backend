import WorktimeModel from '../models/WorkTime.js';
import TeacherModel from '../models/Teacher.js';

export const createWorktime = async (request, response) => {
    try {
        const data = request.body;
        const doc = new WorktimeModel({...data});
        const worktime = await doc.save();

        if (worktime) {
            const teacher = await TeacherModel.findOne({_id: data.teacher});
            if (teacher) {
                teacher.worktimes.push(worktime._id);
                console.log(teacher.worktimes)
                await teacher.save();
                return response.status(200).json({message: 'Worktime was created'})
            } else {
                return response.status(400).json({message: 'Worktime was not added to teacher'})
            }
        
        } else {
            return response.status(400).json({message: 'Worktime was not created'})
        }

        
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant create worktime'})
    }
};