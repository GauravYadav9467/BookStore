import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d"
  });
};

export const register = async (req, res) => {
  try {
    const { username, email, password, passwordConfirm, phone, address, city, pincode } = req.body;

    if (!username || !email || !password || !passwordConfirm) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const user = await User.create({
      username,
      email,
      password,
      phone: phone || "",
      address: address || "",
      city: city || "",
      pincode: pincode || ""
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        pincode: user.pincode
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        pincode: user.pincode
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { phone, address, city, pincode } = req.body;
    const userId = req.user.id;

    if (!phone || !address || !city || !pincode) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { phone, address, city, pincode },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        city: user.city,
        pincode: user.pincode
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
