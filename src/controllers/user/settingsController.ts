import { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import UserModel from "../../models/userModel";
import global from "../../types/types";
import {
	editNameBody,
	editEmailBody,
	editPasswordBody,
} from "../../schemas/userSchema";

// @desc Update name
// @route PATCH /api/users/edit/name
// @access Private
export const updateName = async (
	req: Request<{}, {}, editNameBody["body"]>,
	res: Response,
	next: NextFunction
) => {
	try {
		if (
			req.user.id === process.env.GUEST_ADMIN_ACCOUNT_ID ||
			req.user.id === process.env.GUEST_ACCOUNT_ID
		) {
			throw new Error("Guest account info cannot be changed.");
		}

		const { firstName, lastName } = req.body;

		// Update user information
		await UserModel.findByIdAndUpdate(
			req.user._id,
			{
				firstName,
				lastName,
			},
			{
				new: true,
			}
		);

		return res.status(200).json({
			firstName,
			lastName,
		});
	} catch (error) {
		res.status(400);
		next(error);
	}
};

// @desc Update email
// @route PATCH /api/users/edit/email
// @access Private
export const updateEmail = async (
	req: Request<{}, {}, editEmailBody["body"]>,
	res: Response,
	next: NextFunction
) => {
	try {
		if (
			req.user.id === process.env.GUEST_ADMIN_ACCOUNT_ID ||
			req.user.id === process.env.GUEST_ACCOUNT_ID
		) {
			throw new Error("Guest account info cannot be changed.");
		}

		const { email } = req.body;

		if (req.user.email === email) {
			res.status(400);
			throw new Error("Your new email cannot be the same as the original.");
		}

		// Update user information
		await UserModel.findByIdAndUpdate(
			req.user._id,
			{
				email,
			},
			{
				new: true,
			}
		);

		return res.status(200).json({ email });
	} catch (error) {
		res.status(400);
		next(error);
	}
};

// @desc Update password
// @route PATCH /api/users/edit/password
// @access Private
export const updatePassword = async (
	req: Request<{}, {}, editPasswordBody["body"]>,
	res: Response,
	next: NextFunction
) => {
	try {
		if (
			req.user.id === process.env.GUEST_ADMIN_ACCOUNT_ID ||
			req.user.id === process.env.GUEST_ACCOUNT_ID
		) {
			throw new Error("Guest account info cannot be changed.");
		}

		const { currentPassword, newPassword } = req.body;

		if (!(await bcrypt.compare(currentPassword, req.user.password))) {
			throw new Error("Your current password is incorrect. Try again.");
		}

		if (currentPassword === newPassword) {
			throw new Error("Your new password cannot be the same as the original.");
		}

		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(newPassword, salt);

		// Update password
		await UserModel.findByIdAndUpdate(
			req.user._id,
			{
				password: hashedPassword,
			},
			{
				new: true,
			}
		);

		return res.sendStatus(200);
	} catch (error) {
		res.status(400);
		next(error);
	}
};
