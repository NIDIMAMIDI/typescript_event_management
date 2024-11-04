import { Router } from 'express';
import { authRouter } from './auth/auth.routes';
import { eventRouter } from './events/events.routes';
const indexRouter: Router = Router();

indexRouter.use('/auth', authRouter);
indexRouter.use('/events', eventRouter);

export default indexRouter;
