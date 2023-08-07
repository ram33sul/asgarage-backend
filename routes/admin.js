import express from 'express';
import { serviceHandler } from '../services/serviceHandler.js';
import adminAuth from '../authentication/adminAuth.js';
import { acceptProductAdmin, getOrdersAdmin, getProductDetailsAdmin, getProductsAdmin, getUsersAdmin, loginAdmin, rejectProductAdmin, verifyAdmin } from '../services/admin.js';

const router = express.Router();

router.post("/login", serviceHandler(loginAdmin));

router.get("/verify-admin", serviceHandler(verifyAdmin));

router.get("/users", adminAuth, serviceHandler(getUsersAdmin));

router.get("/products", adminAuth, serviceHandler(getProductsAdmin));

router.get("/orders", adminAuth, serviceHandler(getOrdersAdmin));

router.get("/product-details", adminAuth, serviceHandler(getProductDetailsAdmin));

router.put("/accept-product", adminAuth, serviceHandler(acceptProductAdmin));

router.put("/reject-product", adminAuth, serviceHandler(rejectProductAdmin));

const adminRouter = router;

export default adminRouter;