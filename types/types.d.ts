// Add req.user to typescript
export declare global {
	namespace Express {
		interface Request {
			user: any;
			file: any;
		}
	}
}

export interface DecodedToken {
	id: string;
	iat: number;
	exp: number;
}
