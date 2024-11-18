import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import {TeacherController} from '../controllers/controller.js';
import {Teacher} from '../validations/validations.js';

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER', 'ADMIN']), Teacher.createTeacherValidation, TeacherController.createTeacher);
router.get('/', checkAuth, checkRole(['OWNER', 'ADMIN']), TeacherController.getTeachers);
router.patch('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), Teacher.createTeacherValidation, TeacherController.updateTeacher);
router.delete('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), Teacher.createTeacherValidation, TeacherController.deleteTeacher);

export default router;