import { object, string, array, TypeOf, number } from "zod";

export const cartSchema = object({
	params: object({
		id: string({
			required_error: "Params id is required.",
		}),
	}),
	body: object({
		cartItems: array(
			object({
				productId: string({
					required_error: "Id is required.",
				}),
				name: string({
					required_error: "Name is required.",
				}),
				quantity: number({
					required_error: "Quantity is required.",
				}),
				image: string({
					required_error: "Image is required.",
				}),
				price: number({
					required_error: "Price is required.",
				}),
			})
		),
	}),
});

export type cartInput = TypeOf<typeof cartSchema>;
