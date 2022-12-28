import { Schema, model } from "mongoose";

interface Order {
	accountId: Schema.Types.ObjectId;
	purchasedItems: {
		_id: Schema.Types.ObjectId;
		name: string;
		description: string;
		color: string;
		category: string;
		price: number;
		quantity: number;
		image: string;
		imageCloudId: string;
	}[];
	shippingInfo: {
		firstName: string;
		lastName: string;
		address: string;
		aptSuiteEtc?: string;
		state: string;
		city: string;
		zipCode: string;
		phone: string;
		email: string;
	};
	paymentInfo: {
		cardNumber: string;
		cardHolderFirstName: string;
		cardHolderLastName: string;
		expiryDateMonth: string;
		expiryDateYear: string;
		securityCode: string;
		subTotal: number;
	};
}

const orderSchema = new Schema<Order>(
	{
		accountId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
		shippingInfo: {
			firstName: { type: String, required: true },
			lastName: { type: String, required: true },
			address: { type: String, required: true },
			aptSuiteEtc: { type: String },
			state: { type: String, required: true },
			city: { type: String, required: true },
			zipCode: { type: String, required: true },
			phone: { type: String, required: true },
			email: { type: String, required: true },
		},
		purchasedItems: [
			{
				_id: {
					type: Schema.Types.ObjectId,
					required: true,
					ref: "Product",
				},
				name: { type: String, required: true, ref: "Product" },
				description: { type: String, required: true, ref: "Product" },
				color: { type: String, required: true, ref: "Product" },
				category: { type: String, required: true, ref: "Product" },
				price: { type: Number, required: true, ref: "Product" },
				quantity: { type: Number, required: true },
				image: { type: String, required: true, ref: "Product" },
				imageCloudId: { type: String, required: true, ref: "Product" },
			},
		],
		paymentInfo: {
			cardNumber: { type: String, required: true },
			cardHolderFirstName: { type: String, required: true },
			cardHolderLastName: { type: String, required: true },
			expiryDateMonth: { type: String, required: true },
			expiryDateYear: { type: String, required: true },
			securityCode: { type: String, required: true },
			subTotal: { type: Number, required: true },
		},
	},
	{
		timestamps: true,
	}
);

const OrderModel = model<Order>("Order", orderSchema);

export default OrderModel;
