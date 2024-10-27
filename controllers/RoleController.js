import RoleModel from '../models/Role.js';

export const createRole = async (request, response) => {
    try {
        const {value} = request.body;
        const doc = new RoleModel({value});
        const newRole = doc.save();

        if (newRole) {
            return response.status(200).json({message: 'Role was created'})
        } else {
            response.status(400).json({message: 'Role was not created'})
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Role was not created'})
    }
}