import express from 'express';
import { serviceHandler } from '../services/serviceHandler.js';
import { contactUs, editProfile } from '../services/user.js';
import auth from '../authentication/auth.js';

const router = express.Router();

router.post("/edit-profile", auth, serviceHandler(editProfile));

router.post("/contact-us", auth, serviceHandler(contactUs));

const userRouter = router;

export default userRouter;