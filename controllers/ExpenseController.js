import TeacherModel from '../models/Teacher.js';
import ExpenseModel from '../models/Expense.js';
import PayAccountModel from '../models/PayAccount.js'

export const createExpense = async (request, response) => {
    try {
        const data = request.body;
        const doc = new ExpenseModel({...data});
        const payaccount = await PayAccountModel.findById(data.payaccount); 

        if (payaccount.value < data.value) {
            return response.status(400).json({message: 'Баланс на рахунку менший за вказану суму'})
        }

        const expense = await doc.save();

        if (expense) {
            await PayAccountModel.findOneAndUpdate({_id: expense.payaccount}, 
                {
                    $inc: {
                        value: -expense.value
                    }
                }
            )

            return response.status(200).json(expense);
        } else {
            return response.status(400).json({message: 'Cant create expense'})
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant create expense'});
    }
};

export const getExpenses = async (request, response) => {
    try {
        const { limit = 10, page = 0 } = request.query;

        const expenses = await ExpenseModel.paginate({}, {
                                               page: +page + 1, 
                                               limit: limit,
                                               populate:[
                                                {
                                                    path: 'payaccount',
                                                    select: ['_id', 'title']
                                                }
                                            ]  
                                            });
    
        return response.status(200).json(expenses);
    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant get expenses'})
    }
};


export const deleteExpense = async (request, response) => {
    try {
        const id = request.params.id;
        const expense = await ExpenseModel.findById(id);
        const deletad = await ExpenseModel.deleteOne({_id: id});

        if (deletad) {
            await PayAccountModel.findOneAndUpdate({_id: expense.payaccount}, 
                {
                    $inc: {
                    value: expense.value
                    }
                }
            )
            return response.status(200).json({message: 'Expense was deletad'})
        } else {
            return response.status(400).json('Expense was not deleted');
        }

    } catch(error) {
        console.log(error);
        response.status(500).json({message: 'Cant delete Expense'})
    }
};

