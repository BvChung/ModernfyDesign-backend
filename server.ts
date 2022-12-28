import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import express, { Express, Request, Response } from "express";
import "colors";
import { connectDatabase } from "./config/mongoConfig";
import errorHandler from "./middleware/errorHandler";
import userRoutes from "./routes/user/userRoutes";
import adminRoutes from "./routes/admin/adminRoutes";
import orderRoutes from "./routes/order/orderRoutes";
import productRoutes from "./routes/product/productRoutes";
import refreshTokenRoutes from "./routes/token/refreshTokenRoutes";

dotenv.config();
const port = process.env.PORT || 3001;
connectDatabase();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://127.0.0.1:5500",
			"http://localhost:3001",
			"https://modernfydesign.onrender.com",
		],
		credentials: true,
	})
);

app.use(cookieParser());
app.use(compression());

app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/refresh", refreshTokenRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "../frontend/build")));

	app.get("*", (req: Request, res: Response) =>
		res.sendFile(
			path.resolve(__dirname, "../", "frontend", "build", "index.html")
		)
	);
} else {
	app.get("/", (req, res) => res.send("Please set to production"));
}

app.listen(port, () => {
	console.log(`Server live on port: ${port}`.underline.magenta);
});
