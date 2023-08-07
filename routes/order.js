import express from 'express';
import { serviceHandler } from '../services/serviceHandler.js';
import { getOrderDetails, getOrders, postOrder } from '../services/order.js';
import { getProductDetails, getProducts } from '../services/product.js';
import auth from '../authentication/auth.js';

const router = express.Router();

router.post("/add-order", auth, serviceHandler(postOrder));

router.get("/orders", auth, serviceHandler(getOrders));

router.get("/order", auth, serviceHandler(getOrderDetails))

const orderRouter = router;

export default orderRouter;