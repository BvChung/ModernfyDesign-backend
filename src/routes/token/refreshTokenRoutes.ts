import { IRouter, Router } from "express";
import { handleRefreshToken } from "../../controllers/token/refreshTokenController";

const router: IRouter = Router();

router.get("/", handleRefreshToken);

export default router;
