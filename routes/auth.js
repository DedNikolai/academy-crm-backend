import express from 'express';
import {Auth} from '../validations/validations.js'
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import {UserContoller} from '../controllers/controller.js';
import handleValidationErros from '../utils/handleValidationErros.js';

const router = express.Router({ mergeParams: true })

// router.post('/register', Auth.registerValidation, handleValidationErros, UserContoller.registeration)
router.post('/register', checkAuth, checkRole(['OWNER']), Auth.registerValidation, handleValidationErros, UserContoller.registeration)
router.post('/login', Auth.loginValidation, handleValidationErros, UserContoller.login);
router.get('/verify/:id', UserContoller.verifyUser);
router.get('/me', checkAuth, UserContoller.getCurrentUser);
router.post('/forgot-password', Auth.forgotPasswordValidation, handleValidationErros, UserContoller.forgotPassword);
router.patch('/reset-password/:id', Auth.resetPasswordValidation, handleValidationErros, UserContoller.resetPassword);
router.post('/reset-email', checkAuth, checkRole(['OWNER']) , UserContoller.resetEmail);
router.post('/update-email', checkAuth, checkRole(['OWNER']) , UserContoller.updateEmail);
router.patch('/update/:id', checkAuth, checkRole(['OWNER']), Auth.updateValidation, handleValidationErros, UserContoller.updateUser);
router.get('/users', checkAuth, checkRole(['OWNER']), UserContoller.getUsers);
router.get('/users/:id', checkAuth, checkRole(['OWNER']), UserContoller.getUserById);
router.delete('/user/:id', checkAuth, checkRole(['OWNER']), UserContoller.deleteUser)


export default router;