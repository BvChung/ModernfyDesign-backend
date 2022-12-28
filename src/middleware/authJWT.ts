import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/userModel";
import { DecodedToken } from "../types/types";

const verifyJWT = async (req: Request, res: Response, next: NextFunction) => {
	try {
		if (
			!(
				req.headers.authorization &&
				req.headers.authorization.startsWith("Bearer")
			)
		) {
			throw new Error("Unauthorized.");
		}

		// Get token from header
		const token = req.headers.authorization.split(" ")[1];

		// Verify token
		const decodedToken = jwt.verify(
			token,
			process.env.JWT_ACCESS_SECRET!
		) as DecodedToken;

		req.user = await UserModel.findById(decodedToken.id);
	} catch (error) {
		res.status(403);
		next(error);
	}

	next();
};

export default verifyJWT;
