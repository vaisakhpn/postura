import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gymOwnerModel from "../models/gymOwnerModel.js"; // your new model

// Register Gym Owner

const registerGymOwner = async (req, res) => {
  try {
    const { gymName, ownerName, email, phone, password } = req.body;

    if (!gymName || !ownerName || !email || !phone || !password) {
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

    const existingOwner = await gymOwnerModel.findOne({ email });
    if (existingOwner) {
      return res.json({ success: false, message: "Email already registered" });
    }
    const existingGym = await gymOwnerModel.findOne({ gymName });
    if (existingGym) {
      return res.json({ success: false, message: "Gym already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newOwner = new gymOwnerModel({
      gymName,
      ownerName,
      email,
      phone,
      password: hashedPassword,
    });

    const owner = await newOwner.save();

    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      success: true,
      token,
      message: "Gym Owner registered successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// Login

const loginGymOwner = async (req, res) => {
  try {
    const { email, password } = req.body;

    const owner = await gymOwnerModel.findOne({ email });

    if (!owner) {
      return res.json({ success: false, message: "Gym Owner not found" });
    }

    const isMatch = await bcrypt.compare(password, owner.password);

    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: owner._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token, message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

//get profile
const getGymOwnerProfile = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const ownerData = await gymOwnerModel.findById(ownerId).select("-password");

    if (!ownerData) {
      return res.json({ success: false, message: "Owner not found" });
    }

    res.json({ success: true, ownerData });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

export { registerGymOwner, loginGymOwner, getGymOwnerProfile };
