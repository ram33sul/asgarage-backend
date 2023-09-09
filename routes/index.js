import express from 'express';
import accountRouter from './account.js';
import productRouter from './product.js';
import userRouter from './user.js';
import orderRouter from './order.js';
import adminRouter from './admin.js';
import settingsRouter from './settings.js';
import categoryRouter from './category.js';

const router = express.Router();

router.use("/account", accountRouter);

router.use("/user", userRouter)

router.use("/product", productRouter);

router.use("/order", orderRouter)

router.use("/admin", adminRouter)

router.use("/settings", settingsRouter)

router.use("/category", categoryRouter)

const rootRouter = router;

export default rootRouter;