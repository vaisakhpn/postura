import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: {
      type: String,
      default:
        "https://cdn3.iconfinder.com/data/icons/essential-rounded/64/Rounded-31-512.png",
    },
    selectedGym: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GymOwner",
      required: true,
    },
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
