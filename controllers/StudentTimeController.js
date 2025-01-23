import StudentTimeModel from '../models/StudentTime.js';
import StudentModel from '../models/Student.js';

const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', "FRIDAY", "SATURDAY", "Неділя"]

export const createTime = async (request, response) => {
    try {
        const data = request.body;

        const doc = new StudentTimeModel({...data, sortOrder: days.indexOf(data.day)});
        const time = await doc.save();

        if (time) {
            const student = await StudentModel.findOne({_id: data.student});
            if (student) {
                student.lessontimes.push(time._id);
                await student.save();
                return response.status(200).json(time)
            } else {
                return response.status(400).json({message: 'Time was not added to student'})
            }
        
        } else {
            return response.status(400).json({message: 'Time was not created'})
        }

        
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant create Time'})
    }
};

export const updateTime = async (request, response) => {

    try {
        const id = request.params.id;
        const time = request.body;

        StudentTimeModel.findOneAndUpdate({_id: id}, 
            {...time, room: time.room}, {returnDocument: 'after'})
            .then(result => {
                if (!result) {
                    return response.status(400).json({message: `Time not found`})
                }

                return response.status(200).json(result);
        }) 

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant update time'})
    }
};

export const deleteTime = async (request, response) => {
    try {
        const id = request.params.id;

        const time = await StudentTimeModel.findById(id);
        const student = await StudentModel.findById(time.student);
        student.lessontimes.pull(time._id)
        const deletad = await StudentTimeModel.deleteOne({_id: id});
        
        if (deletad) {
            await student.save();
            return response.status(200).json({message: 'Time was deletad', student: time.student})
        } else {
            return response.status(400).json('Time was not deleted');
        }
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant delete time'})
    }
}

export const getStudentTimeByTeacher = async (request, response) => {
    try {
        const id = request.params.id;

        const lessons = await StudentTimeModel.find({teacher: id})
                                            .populate({
                                                path: 'student', 
                                                select: ['_id', 'fullName'],
                                            }).exec();;
    
        return response.status(200).json(lessons);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get lessons'})
    }
};