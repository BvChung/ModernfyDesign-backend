import { IRouter, Router } from "express";
import {
	signInUser,
	registerUser,
	getUser,
	logoutUser,
} from "../../controllers/user/userController";
import { getAccounts } from "../../controllers/admin/adminController";
import {
	updateName,
	updateEmail,
	updatePassword,
} from "../../controllers/user/settingsController";
import {
	registerSchema,
	loginSchema,
	editNameSchema,
	editEmailSchema,
	editPasswordSchema,
} from "../../schemas/userSchema";
import validateRequest from "../../middleware/validateReq";
import verifyJWT from "../../middleware/authJWT";

const router: IRouter = Router();

router.post("/login", validateRequest(loginSchema), signInUser);
router.post("/register", validateRequest(registerSchema), registerUser);
router.get("/me", verifyJWT, getUser);
router.post("/logout", logoutUser);

router.patch(
	"/edit/name",
	[verifyJWT, validateRequest(editNameSchema)],
	updateName
);
router.patch(
	"/edit/email",
	[verifyJWT, validateRequest(editEmailSchema)],
	updateEmail
);
router.patch(
	"/edit/password",
	[verifyJWT, validateRequest(editPasswordSchema)],
	updatePassword
);

router.get("/manage", verifyJWT, getAccounts);

export default router;
