import express from 'express';
import { serviceHandler } from '../services/serviceHandler.js';
import { googleLogin, loginService, requestOTP, signupService, verifyOTP, verifyUser } from '../services/account.js';

const router = express.Router();

router.post("/signup", serviceHandler(signupService));

router.post("/login", serviceHandler(loginService));

router.get("/verify-user", serviceHandler(verifyUser));

router.post("/google-login", serviceHandler(googleLogin));

router.post("/request-otp", serviceHandler(requestOTP));

router.post("/verify-otp", serviceHandler(verifyOTP))

const accountRouter = router;

export default accountRouter;