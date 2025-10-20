import express from "express";
import {
  registerGymOwner,
  loginGymOwner,
  getGymOwnerProfile,
} from "../controllers/gymOwnerController.js";
import authOwner from "../middleware/authOwner.js";

const gymOwnerRouter = express.Router();

gymOwnerRouter.post("/register", registerGymOwner);
gymOwnerRouter.post("/login", loginGymOwner);
gymOwnerRouter.get("/profile", authOwner, getGymOwnerProfile);

export default gymOwnerRouter;
