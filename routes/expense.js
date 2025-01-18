import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import {ExpenseController} from '../controllers/controller.js';
import {Expense} from '../validations/validations.js';
import handleValidationErros from '../utils/handleValidationErros.js';

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER', 'ADMIN']), Expense.expenseValidation, handleValidationErros, ExpenseController.createExpense);
router.get('/', checkAuth, checkRole(['OWNER', 'ADMIN']), ExpenseController.getExpenses);
router.delete('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), ExpenseController.deleteExpense);

export default router;