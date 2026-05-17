import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import "dotenv/config";

import connectDB from "./config/mongodb.js";
import connectColudinary from "./config/cloudinary.js";
import gymOwnerRouter from "./routes/gymOwnerRoutes.js";
import userRouter from "./routes/userRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

const app = express();
const port = process.env.PORT || 5000;

connectDB();
connectColudinary();

app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://postura-gym.vercel.app/",
      ].filter(Boolean);

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.startsWith("http://192.168.") ||
        origin.startsWith("http://10.")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: "Too many requests, please try again later",
});

app.use(limiter);

app.use(compression());
app.use(express.json());

app.use("/api/owner", gymOwnerRouter);
app.use("/api/users", userRouter);
app.use("/api/payment", paymentRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => console.log("Server Started", port));
