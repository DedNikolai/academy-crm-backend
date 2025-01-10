import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import { PayTypeController } from '../controllers/controller.js';
import {PayAccount} from '../validations/validations.js'
import handleValidationErros from '../utils/handleValidationErros.js';

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER']), PayAccount.payAccountValidation, handleValidationErros, PayTypeController.createPayAccount);
router.get('/', checkAuth, checkRole(['OWNER', 'ADMIN']), PayTypeController.getPayAccounts);

export default router;