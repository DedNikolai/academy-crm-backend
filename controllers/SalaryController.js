import TeacherModel from '../models/Teacher.js';
import SalaryModel from '../models/Salary.js';
import PayAccountModel from '../models/PayAccount.js'

export const createSalary = async (request, response) => {
    try {
        const data = request.body;
        const doc = new SalaryModel({...data});
        const teacher = await TeacherModel.findById(data.teacher);
        const payaccount = await PayAccountModel.findById(data.payaccount); 
        
        if (teacher.balance < data.value) {
            return response.status(400).json({message: 'Баланс вчителя менший за вказану суму'})
        }

        if (payaccount.value < data.value) {
            return response.status(400).json({message: 'Баланс на рахунку менший за вказану суму'})
        }

        const salary = await doc.save();

        if (salary) {
            await PayAccountModel.findOneAndUpdate({_id: salary.payaccount}, 
                {
                    $inc: {
                        value: -salary.value
                    }
                }
            )
            await TeacherModel.findOneAndUpdate({_id: teacher._id}, 
                {
                    $inc: {
                    balance: -salary.value
                    }
                }
            )
            return response.status(200).json(salary);
        } else {
            return response.status(400).json({message: 'Cant create salary'})
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant create salary'});
    }
};

export const getSalaries = async (request, response) => {
    try {
        const { limit = 10, page = 0 } = request.query;

        const salaries = await SalaryModel.paginate({}, {
                                               page: +page + 1, 
                                               limit: limit,
                                               populate:[
                                                {
                                                    path: 'teacher',
                                                    select: ['_id', 'fullName', 'balance']
                                                },
                                                {
                                                    path: 'payaccount',
                                                    select: ['_id', 'title']
                                                }

                                            ]  
                                            });
    
        return response.status(200).json(salaries);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get salaries'})
    }
};


export const deleteSalary = async (request, response) => {
    try {
        const id = request.params.id;
        const salary = await SalaryModel.findById(id);
        const teacher = await TeacherModel.findById(salary.teacher);
        const deletad = await SalaryModel.deleteOne({_id: id});

        if (deletad) {
            await TeacherModel.findOneAndUpdate({_id: teacher._id}, 
                {
                    $inc: {
                    balance: salary.value
                    }
                }
            )
            await PayAccountModel.findOneAndUpdate({_id: salary.payaccount}, 
                {
                    $inc: {
                    value: salary.value
                    }
                }
            )
            return response.status(200).json({message: 'Salary was deletad'})
        } else {
            return response.status(400).json('Salary was not deleted');
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant delete Salary'})
    }
};

