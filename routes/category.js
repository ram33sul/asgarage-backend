import { Router } from 'express'
import adminAuth from '../authentication/adminAuth.js';
import { serviceHandler } from '../services/serviceHandler.js';
import { addCategory, deleteCategory, getCategories, getCategoryDetails } from '../services/category.js';
import multer from 'multer';

const router = Router();

router.post("/category", adminAuth, multer().single("image"), serviceHandler(addCategory));

router.get("/categories", serviceHandler(getCategories));

router.get("/category-details", adminAuth, serviceHandler(getCategoryDetails));

router.delete("/category", adminAuth, serviceHandler(deleteCategory));

const categoryRouter = router;

export default categoryRouter;