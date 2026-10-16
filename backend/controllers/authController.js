const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: "All fields are required.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error("Register error:", error);

    return res.status(500).json({
      message: "Server error.",
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: "Email and password are required.",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res.status(200).json({
      message: "Login successful.",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        theme: user.theme, // saved theme of this user
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error.",
    });
  }
};

// GET /theme  -> logged-in user's saved theme
const getTheme = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("theme");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ theme: user.theme });
  } catch (error) {
    console.error("Get theme error:", error);

    return res.status(500).json({ message: "Server error." });
  }
};

// PUT /theme  -> save logged-in user's theme
const updateTheme = async (req, res) => {
  try {
    const { theme } = req.body;

    if (!["light", "dark"].includes(theme)) {
      return res.status(400).json({ message: "Invalid theme." });
    }

    await User.findByIdAndUpdate(req.user.userId, { theme });

    return res.status(200).json({ theme });
  } catch (error) {
    console.error("Update theme error:", error);

    return res.status(500).json({ message: "Server error." });
  }
};

module.exports = { registerUser, loginUser, getTheme, updateTheme };