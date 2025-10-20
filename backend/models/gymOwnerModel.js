import mongoose from "mongoose";

const gymOwnerSchema = new mongoose.Schema(
  {
    gymName: {
      type: String,
      required: true,
      trim: true,
    },
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const GymOwner =
  mongoose.model.GymOwner || mongoose.model("GymOwner", gymOwnerSchema);
export default GymOwner;
