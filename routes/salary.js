import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import {SalaryController} from '../controllers/controller.js';
import {Salary} from '../validations/validations.js';
import handleValidationErros from '../utils/handleValidationErros.js';

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER', 'ADMIN']), Salary.salaryValidation, handleValidationErros, SalaryController.createSalary);
router.get('/', checkAuth, checkRole(['OWNER', 'ADMIN']), SalaryController.getSalaries);
router.delete('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), SalaryController.deleteSalary);

export default router;