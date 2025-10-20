import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectColudinary from "./config/cloudinary.js";
import gymOwnerRouter from "./routes/gymOwnerRoutes.js";
import userRouter from "./routes/userRoutes.js";

// app config

const app = express();
const port = process.env.PORT || 4000;
connectDB();
connectColudinary();

// middlewares
app.use(express.json());
app.use(cors());

// api endpoints
app.use("/api/owner", gymOwnerRouter);
app.use("/api/user", userRouter);

app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(port, () => console.log("Server Started", port));
