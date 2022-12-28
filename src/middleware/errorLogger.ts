import { ErrorRequestHandler, Request, Response, NextFunction } from "express";

export const logger: ErrorRequestHandler = (
	err,
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const statusCode = res.statusCode ? res.statusCode : 500;

	console.log(
		`[Error on ${new Date().toLocaleString()}]: ${err.message}`.red.underline
	);

	res.status(statusCode).json({
		message: err.message,
	});
};
