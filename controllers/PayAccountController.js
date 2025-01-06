import PayAccountModel from '../models/PayAccount.js';

export const createPayAccount = async (request, response) => {

    try {
        const value = request.body;
        const doc = new PayAccountModel(value);
        const newType = doc.save();

        if (newType) {
            return response.status(200).json({message: 'PayAccount was created'})
        } else {
            response.status(400).json({message: 'PayAccount was not created'})
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'PayAccount was not created'})
    }
}