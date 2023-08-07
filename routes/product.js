import express from 'express';
import { serviceHandler } from '../services/serviceHandler.js';
import { addProduct, getAddedProducts, getProductDetails, getProducts } from '../services/product.js';
import multer from 'multer'
import auth from '../authentication/auth.js';

const router = express.Router();

router.get("/products", serviceHandler(getProducts));

router.post("/add-product", auth, multer().array('images') , serviceHandler(addProduct));

router.get("/added-products", auth, serviceHandler(getAddedProducts));

router.get("/:productId", serviceHandler(getProductDetails))

const productRouter = router;

export default productRouter;