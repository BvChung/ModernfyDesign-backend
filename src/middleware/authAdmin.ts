import { Request, Response, NextFunction } from "express";
import { accessRoles } from "../helper/accessRoles";
import global from "../types/types";

export const verifyAdmin = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (
			req.user.role !== accessRoles.Admin &&
			req.user.role !== accessRoles.Manager
		) {
			throw new Error("Unauthorized access.");
		}
	} catch (error) {
		res.status(401);
		next(error);
	}

	next();
};
