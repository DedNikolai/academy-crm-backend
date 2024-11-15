import WorktimeModel from '../models/WorkTime.js';

export const createWorktime = async (request, response) => {
    try {
        const data = request.body;
        const doc = new WorktimeModel({...data});
        const workTime = doc.save();
        if (workTime) {
            return response.status(200).json({message: 'Worktime was created'})
        } else {
            return response.status(400).json({message: 'Worktime was not created'})
        }
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant create worktime'})
    }
};