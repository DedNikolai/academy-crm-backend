import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import {WorkTime} from '../validations/validations.js';
import {WorktimeController} from '../controllers/controller.js';
import handleValidationErros from '../utils/handleValidationErros.js';

const router = express.Router({mergeParams: true});

router.post('/', checkAuth, checkRole(['OWNER', 'ADMIN']), WorkTime.createWorkTimeValidation, handleValidationErros, WorktimeController.createWorktime);
router.patch('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), WorkTime.createWorkTimeValidation, handleValidationErros, WorktimeController.updateWorkTime);
router.delete('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), WorktimeController.deleteWorkTime);

export default router;