import express from "express";
import {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllGyms,
} from "../controllers/userController.js";
import authUser from "../middleware/authUser.js";
import upload from "../middleware/multer.js";

const userRouter = express.Router();

userRouter.post("/register", upload.single("profilePic"), registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post(
  "/update-profile",
  upload.single("profilePic"),
  authUser,
  updateProfile
);

userRouter.get("/gyms", getAllGyms);

export default userRouter;
