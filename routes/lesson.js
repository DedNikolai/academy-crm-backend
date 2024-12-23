import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import lessonValidation from '../utils/lesssonValidation.js'
import {LessonController} from '../controllers/controller.js';
import {Lesson} from '../validations/validations.js';
import handleValidationErros from '../utils/handleValidationErros.js';

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER', 'ADMIN']), Lesson.lessonValidation, handleValidationErros, lessonValidation, LessonController.createLesson);
router.get('/', checkAuth, checkRole(['OWNER', 'ADMIN']), LessonController.getLessons);
router.patch('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), Lesson.lessonValidation, handleValidationErros, lessonValidation, LessonController.updateLesson);
router.delete('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), LessonController.deleteLesson);
router.get('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), LessonController.getLessonById);
router.get('/student/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), LessonController.getLessonsByStudent);
router.get('/ticket/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), LessonController.getLessonsByTicket);

export default router;