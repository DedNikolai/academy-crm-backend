import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import {SubjectController} from '../controllers/controller.js';
import { Subject } from '../validations/validations.js';

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER']), Subject.createSubjectValidation, SubjectController.createSubject);

export default router;