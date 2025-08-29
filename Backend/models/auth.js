// backend/routes/auth.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const genToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

/**
 * POST /api/auth/register
 * body: { name?, username, email, password }
 */
router.post("/register", async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!username || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const exists =
      (await User.findOne({ email })) || (await User.findOne({ username }));
    if (exists) return res.status(400).json({ message: "User already exists" });

    const user = await User.create({ name, username, email, password });
    return res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email, name: user.name },
      token: genToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/**
 * POST /api/auth/login
 * body: { emailOrUsername, password }
 */
router.post("/login", async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({
      $or: [{ email: emailOrUsername }, { username: emailOrUsername }],
    }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { _id, username, email, name } = user;
    res.json({
      user: { id: _id, username, email, name },
      token: genToken(_id),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router;
