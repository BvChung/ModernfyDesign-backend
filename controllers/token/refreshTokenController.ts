import { Request, Response, NextFunction } from "express";
import UserModel from "../../models/userModel";
import jwt from "jsonwebtoken";
import { generateAccessToken } from "../../helper/JWTGeneration";
import { DecodedToken } from "../../types/types";

// @desc Refresh JWT
// @route GET /api/refresh/
// @access Public
export const handleRefreshToken = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// JWT sent as cookie
		const cookies = req.cookies;

		const refreshToken = cookies.jwt;

		// Value of JWT token is compared to value stored in mongoDB
		const foundUser = await UserModel.findOne({ refreshToken: refreshToken });

		if (!foundUser) return res.sendStatus(403);

		const decodedToken = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_SECRET!
		) as DecodedToken;

		const accessToken = generateAccessToken(decodedToken.id);

		return res.json(accessToken);
	} catch (error) {
		res.status(403);
		next(error);
	}
};
