import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import UserModel from "../../models/userModel";
import {
	generateAccessToken,
	generateRefreshToken,
} from "../../helper/JWTGeneration";
import global from "../../types/types";
import { registerBody, loginBody } from "../../schemas/userSchema";

// For schema data:
// ._id => new ObjectId("6278dd9dadc7cdbc6f7ec28c")
// .id => 6278dd9dadc7cdbc6f7ec28c

// @desc Login user
// @route POST /api/users/login
// @access Public
export const signInUser = async (
	req: Request<{}, {}, loginBody["body"]>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { email, password } = req.body;

		// Check for user based on email
		const foundUser = await UserModel.findOne({ email });

		if (!foundUser) {
			throw new Error("Email and/or password do not match.");
		}

		if (!(await bcrypt.compare(password, foundUser.password))) {
			throw new Error("Email and/or password do not match.");
		}

		const refreshToken = generateRefreshToken(foundUser._id);

		await UserModel.findByIdAndUpdate(
			foundUser._id,
			{
				refreshToken,
			},
			{
				new: true,
			}
		);

		res
			.status(200)
			.cookie("jwt", refreshToken, {
				sameSite: "strict",
				httpOnly: true,
				secure: true,
				maxAge: 24 * 60 * 60 * 1000,
			})
			.cookie("name", `${foundUser.firstName}_${foundUser.lastName}`, {
				sameSite: "strict",
				httpOnly: true,
				secure: true,
				maxAge: 24 * 60 * 60 * 1000,
			})
			.json({
				_id: foundUser.id,
				firstName: foundUser.firstName,
				lastName: foundUser.lastName,
				email: foundUser.email,
				role: foundUser.role,
				accessToken: generateAccessToken(foundUser._id),
			});
	} catch (error: any) {
		res.status(401);
		next(error);
	}
};

// @desc Register new user
// @route POST /api/users/register
// @access Public
export const registerUser = async (
	req: Request<{}, {}, registerBody["body"]>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { firstName, lastName, email, password, role } = req.body;

		// Check if user exists in the database based on email
		const dupeEmail = await UserModel.findOne({ email });

		if (dupeEmail) {
			res.status(409);
			throw new Error("This email address is already in use.");
		}
		if (password.slice(0, 1) === " " || password.slice(-1) === " ") {
			res.status(400);
			throw new Error("Your password cannot begin or end with a blank space.");
		}

		// Hash(encrypt) password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Create User using mongoose schema
		const user = await UserModel.create({
			firstName,
			lastName,
			email,
			password: hashedPassword,
			role,
		});

		if (!user) throw new Error("Invalid user data");

		// Create JWT refresh token based on Schema Id
		const refreshToken = generateRefreshToken(user._id);

		await UserModel.findByIdAndUpdate(
			user._id,
			{
				refreshToken,
			},
			{
				new: true,
			}
		);

		return res
			.status(201)
			.cookie("jwt", refreshToken, {
				sameSite: "strict",
				httpOnly: true,
				secure: true,
				maxAge: 24 * 60 * 60 * 1000,
			})
			.cookie("name", `${user.firstName}_${user.lastName}`, {
				sameSite: "strict",
				httpOnly: true,
				secure: true,
				maxAge: 24 * 60 * 60 * 1000,
			})
			.json({
				_id: user.id,
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				role: user.role,
				accessToken: generateAccessToken(user._id),
			});
	} catch (error: any) {
		res.status(401);
		next(error);
	}
};

// @desc Get user
// @route GET /api/users/me
// @access Private
export const getUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		res.status(200).json({
			_id: req.user.id,
			firstName: req.user.firstName,
			lastName: req.user.lastName,
			email: req.user.email,
			role: req.user.role,
		});
	} catch (error) {
		res.status(404);
		next(error);
	}
};

// @desc Logout user
// @route POST /api/users/logout
// @access Public
export const logoutUser = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const cookies = req.cookies;

		// If no cookie => logout
		if (!cookies?.jwt) return res.sendStatus(204);

		const refreshToken = cookies.jwt;

		const foundUser = await UserModel.findOne({ refreshToken: refreshToken });

		// No token in DB => clear cookie + logout
		if (!foundUser) {
			res.clearCookie("jwt", {
				httpOnly: true,
				sameSite: "strict",
				secure: true,
			});
			return res.sendStatus(204);
		}

		// Remove refresh JWT + cookie + logout
		await UserModel.findOneAndUpdate(
			{ refreshToken: refreshToken },
			{
				$unset: {
					refreshToken: "",
				},
			},
			{
				new: true,
			}
		);

		res
			.clearCookie("jwt", {
				httpOnly: true,
				sameSite: "strict",
				secure: true,
			})
			.clearCookie("name", {
				httpOnly: true,
				sameSite: "strict",
				secure: true,
			});

		return res.sendStatus(204);
	} catch (error) {
		next(error);
	}
};
