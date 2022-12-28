import { Router, IRouter } from "express";
import {
	signInAdmin,
	getAccounts,
	editRole,
	deleteAccount,
} from "../../controllers/admin/adminController";
import {
	createProduct,
	deleteProduct,
	getInventory,
	getInventoryItem,
	updateProduct,
} from "../../controllers/admin/inventoryController";
import verifyJWT from "../../middleware/authJWT";
import { verifyAdmin } from "../../middleware/authAdmin";
import { accountUpdateBodySchema } from "../../schemas/adminSchema";
import {
	productParamsSchema,
	productUpdateBodySchema,
	productCreationBodySchema,
} from "../../schemas/productSchema";
import validateRequest from "../../middleware/validateReq";

const router: IRouter = Router();

router.post("/signin", signInAdmin);

router
	.route("/inventory")
	.get([verifyJWT, verifyAdmin], getInventory)
	.post(
		[verifyJWT, verifyAdmin, validateRequest(productCreationBodySchema)],
		createProduct
	);

router
	.route("/inventory/:id")
	.get([verifyJWT, verifyAdmin], getInventoryItem)
	.patch(
		[
			verifyJWT,
			verifyAdmin,
			validateRequest(productParamsSchema),
			validateRequest(productUpdateBodySchema),
		],
		updateProduct
	)
	.delete(
		[verifyJWT, verifyAdmin, validateRequest(productParamsSchema)],
		deleteProduct
	);

router.get("/manage", [verifyJWT, verifyAdmin], getAccounts);
router.patch(
	"/edit",
	[verifyJWT, verifyAdmin, validateRequest(accountUpdateBodySchema)],
	editRole
);
router.delete("/delete/:id", [verifyJWT, verifyAdmin], deleteAccount);

export default router;
