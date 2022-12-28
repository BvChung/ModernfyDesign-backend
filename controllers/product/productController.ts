import { Request, Response, NextFunction } from "express";
import ProductModel from "../../models/productModel";
import global from "../../types/types";
import { productParams } from "../../schemas/productSchema";
import dotenv from "dotenv";
dotenv.config();

// @desc Get all products
// @route GET /api/products/
// @access Public
export const getAllProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const products = await ProductModel.find({});

		res.status(200).json(products);
	} catch (error) {
		res.status(400);
		next(error);
	}
};

// @desc Get queried products
// @route GET /api/products/query
// @access Public
export const queryProducts = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		if (!req.query.priceLow || !req.query.priceHigh) {
			return;
		}

		let queriedProducts;
		let minPrice;
		let maxPrice;

		if (req.query.priceLow === "min") {
			minPrice = 0.01;
		} else {
			minPrice = +req.query.priceLow;
		}

		if (req.query.priceHigh === "max") {
			maxPrice = Number.MAX_SAFE_INTEGER;
		} else {
			maxPrice = +req.query.priceHigh;
		}

		// Products are returned based on query
		// 1) Query contains category + price filter
		// 2) Query contains price filter
		// 3) Query contains category filter
		// 4) No query => returns all products
		if (req.query.category && minPrice && maxPrice) {
			queriedProducts = await ProductModel.find({
				category: { $in: req.query.category },
				price: { $gte: minPrice, $lt: maxPrice },
			});
		} else if (minPrice && maxPrice) {
			queriedProducts = await ProductModel.find({
				price: { $gte: minPrice, $lt: maxPrice },
			});
		} else if (req.query.category) {
			queriedProducts = await ProductModel.find({
				category: { $in: req.query.category },
			});
		} else {
			queriedProducts = await ProductModel.find({});
		}

		res.status(200).json(queriedProducts);
	} catch (error) {
		res.status(400);
		next(error);
	}
};

// @desc Get cart items
// @route GET /api/products/cart
// @access Public
export const getCartItemsInfo = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		// productIds is an array containing item ids from the current account's cart
		// Iterates through productIds array and returns array with info of each product from the database
		const myCartItems = await ProductModel.find({
			_id: { $in: req.query.productIds },
		});

		res.status(200).json(myCartItems);
	} catch (error) {
		res.status(404);
		next(error);
	}
};

// @desc Get product info
// @route GET /api/products/:id
// @access Public
export const getProductInfo = async (
	req: Request<productParams["params"], {}, {}>,
	res: Response,
	next: NextFunction
) => {
	try {
		const productInfo = await ProductModel.findById(req.params.id);

		if (!productInfo) {
			throw new Error("This product could not be found.");
		}

		res.status(200).json(productInfo);
	} catch (error) {
		res.status(404);
		next(error);
	}
};
