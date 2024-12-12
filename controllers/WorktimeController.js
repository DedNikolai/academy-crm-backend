import WorktimeModel from '../models/WorkTime.js';
import TeacherModel from '../models/Teacher.js';

const days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", "Субота", "Неділя"]

export const createWorktime = async (request, response) => {
    try {
        const data = request.body;

        const doc = new WorktimeModel({...data, sortOrder: days.indexOf(data.day)});
        const worktime = await doc.save();

        if (worktime) {
            const teacher = await TeacherModel.findOne({_id: data.teacher});
            if (teacher) {
                teacher.worktimes.push(worktime._id);
                await teacher.save();
                return response.status(200).json(worktime)
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

export const updateWorkTime = async (request, response) => {
    try {
        const id = request.params.id;
        const {day, startTime, endTime, teacher} = request.body;

        WorktimeModel.findOneAndUpdate({_id: id}, 
            {day, teacher, startTime, endTime}, {returnDocument: 'after'})
            .then(result => {
                if (!result) {
                    return response.status(400).json({message: `Worktime not found`})
                }

                return response.status(200).json(result);
        }) 

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant update worktime'})
    }
};

export const deleteWorkTime = async (request, response) => {
    try {
        const id = request.params.id;

        const worktime = await WorktimeModel.findById(id);
        const teacher = await TeacherModel.findById(worktime.teacher);
        teacher.worktimes.pull(worktime._id)
        const deletad = await WorktimeModel.deleteOne({_id: id});
        
        if (deletad) {
            await teacher.save();
            return response.status(200).json({message: 'Worktime was deletad', teacher: worktime.teacher})
        } else {
            return response.status(400).json('Worktime was not deleted');
        }
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant delete worktime'})
    }
}