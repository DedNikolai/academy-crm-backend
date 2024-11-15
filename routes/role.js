import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import { RoleController } from '../controllers/controller.js';
import {Role} from '../validations/validations.js'

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER']), Role.createRoleValidation, RoleController.createRole);

export default router;