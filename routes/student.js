import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import {StudentController} from '../controllers/controller.js';
import {Student} from '../validations/validations.js';
import handleValidationErros from '../utils/handleValidationErros.js';

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER', 'ADMIN']), Student.studentValidation, handleValidationErros, StudentController.createStudent);
router.get('/', checkAuth, checkRole(['OWNER', 'ADMIN']), StudentController.getStudents);
router.patch('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), Student.studentValidation, handleValidationErros, StudentController.updateStudent);
router.delete('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), StudentController.deleteStudent);
router.get('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), StudentController.getStudentById);

export default router;