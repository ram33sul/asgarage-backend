import { Router } from 'express'
import { serviceHandler } from '../services/serviceHandler.js';
import { addSettings, changePasswordAdmin, editSettings, getSettings, hidePopup, showPopup } from '../services/settings.js';
import multer from 'multer';
import adminAuth from '../authentication/adminAuth.js';

const router = Router();

router.post("/settings", adminAuth, multer().any(), serviceHandler(addSettings));

router.get("/settings", serviceHandler(getSettings));

router.put("/settings", adminAuth, serviceHandler(editSettings));

router.put("/hide-popup", adminAuth, serviceHandler(hidePopup));

router.put("/show-popup", adminAuth, serviceHandler(showPopup));

router.post("/change-password", adminAuth, serviceHandler(changePasswordAdmin));

const settingsRouter = router;

export default settingsRouter;