const jwt = require("jsonwebtoken");
const User = require("../models/User");

function createToken(userId) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function publicUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
  };
}

async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Please enter your name." });
    }
    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({ message: "Please enter your email." });
    }
    if (typeof password !== "string" || password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const user = await User.create({ name, email, password });
    return res.status(201).json({
      token: createToken(user._id.toString()),
      user: publicUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (typeof email !== "string" || !email.trim() || typeof password !== "string" || !password) {
      return res.status(400).json({ message: "Please enter your email and password." });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await user.checkPassword(password))) {
      return res.status(401).json({ message: "Email or password is incorrect." });
    }

    return res.json({
      token: createToken(user._id.toString()),
      user: publicUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { signup, login };
