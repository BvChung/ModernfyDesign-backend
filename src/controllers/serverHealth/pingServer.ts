import { Router, Request, Response, NextFunction } from "express";

const router = Router();

const pingServer = async (req: Request, res: Response, next: NextFunction) => {
	try {
		res.status(200).json({ message: "Server pinged" });
	} catch (error) {
		res.status(404).json({ message: "Server error" });
		next(error);
	}
};

router.get("/", pingServer);

export default router;
