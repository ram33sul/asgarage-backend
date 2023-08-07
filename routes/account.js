import express from 'express';
import { serviceHandler } from '../services/serviceHandler.js';
import { loginService, signupService, verifyUser } from '../services/account.js';

const router = express.Router();

router.post("/signup", serviceHandler(signupService));

router.post("/login", serviceHandler(loginService));

router.get("/verify-user", serviceHandler(verifyUser));

const accountRouter = router;

export default accountRouter;