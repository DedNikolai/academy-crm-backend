import express from 'express';
import checkAuth from '../utils/checkAuth.js';
import checkRole from '../utils/ckeckRole.js';
import {TicketController} from '../controllers/controller.js';
import {Ticket} from '../validations/validations.js';
import handleValidationErros from '../utils/handleValidationErros.js';

const router = express.Router({ mergeParams: true });

router.post('/', checkAuth, checkRole(['OWNER', 'ADMIN']), Ticket.ticketValidation, handleValidationErros, TicketController.createTicket);
router.get('/', checkAuth, checkRole(['OWNER', 'ADMIN']), TicketController.getTickets);
router.patch('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), Ticket.ticketValidation, handleValidationErros, TicketController.updateTicket);
router.delete('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), TicketController.deleteTicket);
router.get('/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), TicketController.getTicketById);
router.get('/student/:id', checkAuth, checkRole(['OWNER', 'ADMIN']), TicketController.getTicketsByStudent);

export default router;