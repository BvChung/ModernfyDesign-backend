import { IRouter, Router } from "express";
import validateRequest from "../../middleware/validateReq";
import {
	getAllProducts,
	queryProducts,
	getProductInfo,
	getCartItemsInfo,
} from "../../controllers/product/productController";
import { productParamsSchema } from "../../schemas/productSchema";

const router: IRouter = Router();

router.route("/").get(getAllProducts);
router.route("/query").get(queryProducts);
router.route("/cart").get(getCartItemsInfo);
router.route("/:id").get(validateRequest(productParamsSchema), getProductInfo);

export default router;
