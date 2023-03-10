import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import compression from "compression";
import express, { Express, Response, Request } from "express";
import "colors";
import { connectDatabase } from "./config/mongoConfig";
import { logger } from "./middleware/errorLogger";
import userRoutes from "./routes/user/userRoutes";
import adminRoutes from "./routes/admin/adminRoutes";
import orderRoutes from "./routes/order/orderRoutes";
import productRoutes from "./routes/product/productRoutes";
import refreshTokenRoutes from "./routes/token/refreshTokenRoutes";
import pingServer from "./controllers/serverHealth/pingServer";

dotenv.config();
connectDatabase();

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
	cors({
		origin: [
			"http://localhost:3000",
			"http://localhost:3001",
			`${process.env.DEPLOYMENT_URL}`,
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
app.use("/api/health", pingServer);
app.use("*", (req: Request, res: Response) => {
	res.status(404).json({ message: "Not found" });
});

app.use(logger);

export default app;
