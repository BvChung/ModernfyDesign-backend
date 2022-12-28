import { object, string, array, TypeOf, number } from "zod";

export const orderParamsSchema = object({
	params: object({
		id: string({ required_error: "Order id params is required." }),
	}),
});

export const orderBodySchema = object({
	body: object({
		accountId: string({
			required_error: "Account id is required.",
		}),
		shippingInfo: object({
			firstName: string({
				required_error: "First name is required.",
			}),
			lastName: string({
				required_error: "Last name is required.",
			}),
			address: string({
				required_error: "Address is required.",
			}),
			aptSuiteEtc: string().optional(),
			state: string({
				required_error: "State is required.",
			}),
			city: string({
				required_error: "City is required.",
			}),
			zipCode: string({
				required_error: "Zip code is required.",
			}),
			phone: string({
				required_error: "Phone is required.",
			}),
			email: string({
				required_error: "Phone is required.",
			}),
		}),
		purchasedItems: array(
			object({
				_id: string({
					required_error: "Id is required.",
				}),
				name: string({
					required_error: "Name is required.",
				}),
				description: string({
					required_error: "Description is required.",
				}),
				color: string({
					required_error: "Color is required.",
				}),
				category: string({
					required_error: "Category is required.",
				}),
				price: number({
					required_error: "Price is required.",
				}),
				quantity: number({
					required_error: "Quantity is required.",
				}),
				image: string({
					required_error: "Image is required.",
				}),
				imageCloudId: string({
					required_error: "ImageCloudId is required.",
				}),
			})
		),
		paymentInfo: object({
			cardNumber: string({
				required_error: "Card number is required.",
			}),
			cardHolderFirstName: string({
				required_error: "Card number is required.",
			}),
			cardHolderLastName: string({
				required_error: "Card number is required.",
			}),
			expiryDateMonth: string({
				required_error: "Card number is required.",
			}),
			expiryDateYear: string({
				required_error: "Card number is required.",
			}),
			securityCode: string({
				required_error: "Card number is required.",
			}),
			subTotal: number({
				required_error: "Total cost is required.",
			}),
		}),
	}),
});

export type orderParams = TypeOf<typeof orderParamsSchema>;
export type orderBody = TypeOf<typeof orderBodySchema>;
