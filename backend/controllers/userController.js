import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import gymOwnerModel from "../models/gymOwnerModel.js";


// =========================
// Register User
// =========================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, selectedGym } = req.body;
    const imageFile = req.file;

    // Validation
    if (!name || !email || !password || !selectedGym) {
      return res.json({ success: false, message: "Missing details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "Email already registered" });
    }

    // Check if gym exists
    const gym = await gymOwnerModel.findById(selectedGym);
    if (!gym) {
      return res.json({ success: false, message: "Selected gym not found" });
    }

    // Password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Upload image to cloudinary
    let image = "";
    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      image = upload.secure_url;
    }

    // Save new user
    const user = new userModel({
      name,
      email,
      password: hashedPassword,
      profilePic: image,
      selectedGym,
    });
    const savedUser = await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      token,
      message: "User registered successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// =========================
// Login User
// =========================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// =========================
// Get User Profile
// =========================
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = await userModel
      .findById(userId)
      .populate("selectedGym", "gymName ownerName email phone")
      .select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// =========================
// Update Profile
// =========================
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;
    const imageFile = req.file;

    if (!name) {
      return res.json({ success: false, message: "Missing details" });
    }

    // Update name
    await userModel.findByIdAndUpdate(userId, { name });

    // Update image if provided
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { profilePic: imageURL });
    }

    res.json({ success: true, message: "Profile updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// =========================
// Get All Gyms (Dropdown)
// =========================
const getAllGyms = async (req, res) => {
  try {
    const gyms = await gymOwnerModel.find().select("_id gymName");
    res.json({ success: true, gyms });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { registerUser, loginUser, getProfile, updateProfile, getAllGyms };
