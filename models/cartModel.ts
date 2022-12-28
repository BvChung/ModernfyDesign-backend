import { Types, Schema, model } from "mongoose";

interface Cart {
	user: Types.ObjectId;
	cartItems: {
		productId: Schema.Types.ObjectId;
		name: string;
		description: string;
		category: string;
		price: number;
		quantity: number;
		image: string;
		imageCloudId: string;
	}[];
}

const cartSchema = new Schema<Cart>(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
		cartItems: [
			{
				productId: {
					type: Schema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
				name: { type: String, required: true, ref: "Product" },
				description: { type: String, required: true, ref: "Product" },
				category: { type: String, required: true, ref: "Product" },
				price: { type: Number, required: true, ref: "Product" },
				quantity: { type: Number, required: true },
				image: { type: String, required: true, ref: "Product" },
				imageCloudId: { type: String, required: true, ref: "Product" },
			},
		],
	},
	{
		timestamps: true,
	}
);

const CartModel = model<Cart>("Cart", cartSchema);

export default CartModel;
