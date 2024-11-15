import SubjectModel from '../models/Subject.js';

export const createSubject = async (request, response) => {
    try {
        const {value} = request.body;
        const doc = new SubjectModel({value});

        const subject = doc.save();

        if (subject) {
            return response.status(200).json({message: 'Subject was created'})
        } else {
            return response.status(400).json({message: 'Subject was not created'})
        }
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant create subject'})
    }
}