import { Router } from 'express';
import { authorization } from '../../middleware/authorization/authorization.middleware';
import { createEventValidation } from '../../utils/validations/event.create.validations';
import { allEvents, createEvent } from '../../controllers/events/events.controllers';
export const eventRouter = Router();

eventRouter.use(authorization);

eventRouter.post('/create', createEventValidation, createEvent);
eventRouter.get('/all', allEvents);
