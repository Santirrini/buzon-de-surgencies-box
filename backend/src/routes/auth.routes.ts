import { Router, RequestHandler } from 'express';
import { login } from '../controllers/auth.controller';

const router = Router();

const typedLoginHandler: RequestHandler = login;
router.post('/login', typedLoginHandler);

export default router;
