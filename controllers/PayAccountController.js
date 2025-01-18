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

export const getPayAccounts = async (request, response) => {
    try {
        const accounts = await PayAccountModel.find({});

        response.status(200).json(accounts);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get accounts'})
    }
};

export const updatePayAccount= async (request, response) => {
    try {
        const id = request.params.id;
        const data = request.body;

        PayAccountModel.findOneAndUpdate({_id: id}, 
            {...data}, {returnDocument: 'after'})
            .then(result => {
                if (!result) {
                    return response.status(400).json({message: `Account not found`})
                }

                return response.status(200).json(result);
        }) 

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant update account'})
    }
};