import { IRouter, Router } from "express";
import verifyJWT from "../../middleware/authJWT";
import validateRequest from "../../middleware/validateReq";
import {
	getOrderHistory,
	getOrderInfo,
	createOrder,
	deleteOrder,
} from "../../controllers/order/orderController";
import { orderBodySchema, orderParamsSchema } from "../../schemas/orderSchema";

const router: IRouter = Router();

router
	.route("/")
	.get(verifyJWT, getOrderHistory)
	.post([verifyJWT, validateRequest(orderBodySchema)], createOrder);
router
	.route("/:id")
	.get([verifyJWT, validateRequest(orderParamsSchema)], getOrderInfo)
	.delete([verifyJWT, validateRequest(orderParamsSchema)], deleteOrder);

export default router;
