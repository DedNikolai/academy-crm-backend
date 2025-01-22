import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import studentTimeValidation from '../utils/studentTimeValidation.js'
import {StudentTimeController} from '../controllers/controller.js';
import {StudentTime} from '../validations/validations.js';
import handleValidationErros from '../utils/handleValidationErros.js';

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER', 'ADMIN']), StudentTime.createTimeValidation, handleValidationErros, studentTimeValidation, StudentTimeController.createTime);
router.patch('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), StudentTime.createTimeValidation, handleValidationErros, studentTimeValidation, StudentTimeController.updateTime);
router.delete('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), StudentTimeController.deleteTime);

export default router;