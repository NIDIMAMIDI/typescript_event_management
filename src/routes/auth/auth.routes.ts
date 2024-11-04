import { Router } from 'express';

import { userRegistrationValidation } from '../../utils/validations/user.registration.validation';
import {
  userLogOut,
  userSignIn,
  userSignUp
} from '../../controllers/auth/auth.controllers';
import { userLoginValidation } from '../../utils/validations/user.login.validations';
import { authorization } from '../../middleware/authorization/authorization.middleware';
export const authRouter: Router = Router();

authRouter.post('/signup', userRegistrationValidation, userSignUp);
authRouter.post('/login', userLoginValidation, userSignIn);
authRouter.post('/logout', authorization, userLogOut);
