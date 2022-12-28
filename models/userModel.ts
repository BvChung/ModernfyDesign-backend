import { Schema, model } from "mongoose";

interface User {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	refreshToken: string;
	role: number;
	isActive: boolean;
}

const userSchema = new Schema<User>(
	{
		firstName: {
			type: String,
			required: [true, "First name is required"],
			default: "",
		},
		lastName: {
			type: String,
			required: [true, "Last name is required"],
			default: "",
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			default: "",
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			default: "",
		},
		refreshToken: {
			type: String,
			default: "",
		},
		role: {
			type: Number,
			default: 5050,
		},
		isActive: {
			type: Boolean,
			default: false,
		},
	},
	{
		timestamps: true,
	}
);

const UserModel = model<User>("User", userSchema);

export default UserModel;
