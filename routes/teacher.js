import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import {TeacherController} from '../controllers/controller.js';
import {Teacher} from '../validations/validations.js';
import handleValidationErros from '../utils/handleValidationErros.js';

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER', 'ADMIN']), Teacher.createTeacherValidation, handleValidationErros, TeacherController.createTeacher);
router.get('/', checkAuth, checkRole(['OWNER', 'ADMIN']), TeacherController.getTeachers);
router.patch('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), Teacher.createTeacherValidation, handleValidationErros, TeacherController.updateTeacher);
router.delete('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), TeacherController.deleteTeacher);
router.get('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), TeacherController.getTeacherById);

export default router;