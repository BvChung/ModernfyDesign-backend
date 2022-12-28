import { object, string, TypeOf, number } from "zod";

export const signInSchema = object({
	body: object({
		email: string({
			required_error: "Email is required.",
		}).email("Not a valid email."),
		password: string({
			required_error: "Password is required.",
		}),
	}),
});

export const accountParamsSchema = object({
	params: object({
		id: string({
			required_error: "Account id params is required.",
		}),
	}),
});

export const accountUpdateBodySchema = object({
	body: object({
		_id: string({
			required_error: "Id is required.",
		}),
		role: number({
			required_error: "Account role required.",
		}),
	}),
});

export type signInBody = TypeOf<typeof signInSchema>;
export type accountParams = TypeOf<typeof accountParamsSchema>;
export type accountBody = TypeOf<typeof accountUpdateBodySchema>;
