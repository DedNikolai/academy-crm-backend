import { body } from "express-validator";
import PayAccountModel from '../models/PayAccount.js';

const payaccountValidation = async (id) => {
    const isPayAccount = await PayAccountModel.findById(id);
    if (!isPayAccount) {
        throw new Error('No such teacher');
    }

    return true
};

export const expenseValidation = [
    body('payaccount').custom(payaccountValidation),
    body('value', 'Invalid value').isNumeric(),
    body('title', 'Invalid title').isString(),
];