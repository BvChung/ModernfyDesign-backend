import { object, string, TypeOf, number } from "zod";

export const productParamsSchema = object({
	params: object({
		id: string({
			required_error: "Product id params is required.",
		}),
	}),
});

export const productCreationBodySchema = object({
	body: object({
		name: string({
			required_error: "Product name is required.",
		}),
		description: string({
			required_error: "Product description is required.",
		}),
		color: string({
			required_error: "Product color is required.",
		}),
		price: number({
			required_error: "Product price is required.",
		}),
		category: string({
			required_error: "Product category is required.",
		}),
		image: string({
			required_error: "Product image is required.",
		}),
		fileName: string({
			required_error: "Product file name is required.",
		}),
	}),
});

export const productUpdateBodySchema = object({
	body: object({
		name: string({
			required_error: "Product name is required.",
		}),
		description: string({
			required_error: "Product description is required.",
		}),
		color: string({
			required_error: "Product color is required.",
		}),
		price: number({
			required_error: "Product price is required.",
		}),
		category: string({
			required_error: "Product category is required.",
		}),
		image: string().optional(),
		fileName: string().optional(),
	}),
});

export type productCreationBody = TypeOf<typeof productCreationBodySchema>;
export type productUpdateBody = TypeOf<typeof productUpdateBodySchema>;
export type productParams = TypeOf<typeof productParamsSchema>;
