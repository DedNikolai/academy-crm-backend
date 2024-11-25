import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import { RoleController } from '../controllers/controller.js';
import {Role} from '../validations/validations.js'
import handleValidationErros from '../utils/handleValidationErros.js';

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER']), Role.createRoleValidation, handleValidationErros, RoleController.createRole);

export default router;