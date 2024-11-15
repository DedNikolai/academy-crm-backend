import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import {WorkTime} from '../validations/validations.js';
import {WorktimeController} from '../controllers/controller.js';

const router = express.Router({mergeParams: true});

router.post('/', checkAuth, checkRole(['OWNER', 'ADMIN']), WorkTime.createWorkTimeValidation, WorktimeController.createWorktime);

export default router;