import express from 'express';
import { serviceHandler } from '../services/serviceHandler.js';
import adminAuth from '../authentication/adminAuth.js';
import { acceptProductAdmin, getMessages, getMessagesCount, getOrderDetailsAdmin, getOrdersAdmin, getProductDetailsAdmin, getProductsAdmin, getUserDetails, getUsersAdmin, loginAdmin, markMessagesRead, rejectProductAdmin, verifyAdmin } from '../services/admin.js';
import { addProduct } from '../services/product.js';
import multer from 'multer';

const router = express.Router();

router.post("/login", serviceHandler(loginAdmin));

router.get("/verify-admin", serviceHandler(verifyAdmin));

router.get("/users", adminAuth, serviceHandler(getUsersAdmin));

router.get("/user-details", adminAuth, serviceHandler(getUserDetails))

router.get("/products", adminAuth, serviceHandler(getProductsAdmin));

router.get("/orders", adminAuth, serviceHandler(getOrdersAdmin));

router.get("/order", adminAuth, serviceHandler(getOrderDetailsAdmin));

router.get("/product-details", adminAuth, serviceHandler(getProductDetailsAdmin));

router.put("/accept-product", adminAuth, serviceHandler(acceptProductAdmin));

router.put("/reject-product", adminAuth, serviceHandler(rejectProductAdmin));

router.post("/add-product", adminAuth, multer().array('images') , serviceHandler(addProduct));

router.get("/messages", adminAuth, serviceHandler(getMessages))

router.get("/messages-count", adminAuth, serviceHandler(getMessagesCount))

router.put("/messages-read", adminAuth, serviceHandler(markMessagesRead));



const adminRouter = router;

export default adminRouter;