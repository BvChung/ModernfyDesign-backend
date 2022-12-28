import { Request, Response, NextFunction } from "express";
import ProductModel from "../../models/productModel";
import OrderModel from "../../models/orderModel";
import global from "../../types/types";
import cloudinaryConnection from "../../config/cloudinaryConfig";
import {
	productCreationBody,
	productParams,
	productUpdateBody,
} from "../../schemas/productSchema";
import dotenv from "dotenv";
dotenv.config();

// @desc Get inventory
// @route GET /api/admin/inventory
// @access Private
export const getInventory = async (
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

// @desc Get inventory item
// @route GET /api/admin/inventory/:id
// @access Private
export const getInventoryItem = async (
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

// @desc Create product
// @route POST /api/admin/inventory
// @access Private
export const createProduct = async (
	req: Request<{}, {}, productCreationBody["body"]>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, description, color, price, category, image, fileName } =
			req.body;

		const verifyProducts = await ProductModel.find({
			createdBy: process.env.GUEST_ADMIN_ACCOUNT_ID,
		});
		if (verifyProducts.length > 0) {
			throw new Error("Guest account can only have one created product demo.");
		}

		const uploadedImage = await cloudinaryConnection.uploader.upload(
			image,
			{
				upload_preset: process.env.CLOUDINARY_PRODUCT_UPLOAD,
				public_id: Date.now() + fileName.split(".")[0],
			},
			(err) => {
				if (err) {
					console.log(err);
				}
			}
		);

		const createdProduct = await ProductModel.create({
			name,
			description,
			color,
			price,
			category,
			image: uploadedImage.secure_url,
			imageCloudId: uploadedImage.public_id,
			createdBy: req.user.id,
		});

		if (!createProduct) {
			throw new Error("Product could not be created.");
		}

		res.status(200).json(createdProduct);
	} catch (error) {
		res.status(400);
		next(error);
	}
};

// @desc Update product
// @route PATCH /api/admin/inventory/:id
// @access Private
export const updateProduct = async (
	req: Request<productParams["params"], {}, productUpdateBody["body"]>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { name, description, color, price, category, image, fileName } =
			req.body;
		const { id: productId } = req.params;

		const verifyProduct = await ProductModel.findById(productId);
		if (
			req.user.id === process.env.GUEST_ADMIN_ACCOUNT_ID &&
			verifyProduct?.createdBy !== process.env.GUEST_ADMIN_ACCOUNT_ID
		) {
			throw new Error("Guest account can only update product demo.");
		}

		const foundProduct = await ProductModel.findById(productId);
		if (!foundProduct) throw new Error("Product not found.");

		let uploadedImage;
		if (image && fileName) {
			uploadedImage = await cloudinaryConnection.uploader.upload(
				image,
				{
					upload_preset: process.env.CLOUDINARY_PRODUCT_UPLOAD,
					public_id: Date.now() + fileName.split(".")[0],
				},
				(err) => {
					if (err) {
						console.log(err);
					}
				}
			);

			await cloudinaryConnection.uploader.destroy(foundProduct.imageCloudId);
		}

		const updatedProduct = await ProductModel.findByIdAndUpdate(
			productId,
			{
				name,
				description,
				color,
				price,
				category,
				image: uploadedImage ? uploadedImage.secure_url : foundProduct.image,
				imageCloudId: uploadedImage
					? uploadedImage.public_id
					: foundProduct.imageCloudId,
			},
			{
				new: true,
			}
		);

		await OrderModel.updateMany(
			{
				"purchasedItems._id": productId,
			},
			{
				$set: {
					"purchasedItems.$.name": name,
					"purchasedItems.$.description": description,
					"purchasedItems.$.color": color,
					"purchasedItems.$.price": price,
					"purchasedItems.$.category": category,
					"purchasedItems.$.image": uploadedImage
						? uploadedImage.secure_url
						: foundProduct.image,
					"purchasedItems.$.imageCloudId": uploadedImage
						? uploadedImage.public_id
						: foundProduct.imageCloudId,
				},
			},
			{
				new: true,
			}
		);

		res.status(200).json(updatedProduct);
	} catch (error) {
		res.status(400);
		next(error);
	}
};

// @desc Delete product
// @route GET /api/admin/inventory/:id
// @access Private
export const deleteProduct = async (
	req: Request<productParams["params"], {}, {}>,
	res: Response,
	next: NextFunction
) => {
	try {
		const { id: productId } = req.params;

		const verifyProduct = await ProductModel.findById(productId);
		if (
			req.user.id === process.env.GUEST_ADMIN_ACCOUNT_ID &&
			verifyProduct?.createdBy !== process.env.GUEST_ADMIN_ACCOUNT_ID
		) {
			throw new Error("Guest account can only delete product demo.");
		}

		const deletedProduct = await ProductModel.findByIdAndDelete(productId);

		// Finds all orders with the product and $pull removes deleted product from purchasedItems array;
		await OrderModel.updateMany(
			{
				"purchasedItems._id": productId,
			},
			{
				$pull: {
					"purchasedItems.$._id": productId,
				},
			},
			{
				new: true,
			}
		);

		if (!deletedProduct) throw new Error("Product not found.");

		await cloudinaryConnection.uploader.destroy(deletedProduct.imageCloudId);

		res.status(200).json(deletedProduct);
	} catch (error) {
		res.status(400);
		next(error);
	}
};
