import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Seed users (runs once)
export const seedUsers = async () => {
  const users = [
    { email: "viewer@vite.co.in", password: "pass123", role: "viewer" },
    { email: "analyst@vite.co.in", password: "pass123", role: "analyst" }
  ];

  for (let u of users) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      const hashed = await bcrypt.hash(u.password, 10);
      await User.create({ email: u.email, password: hashed, role: u.role });
    }
  }
  console.log("Users seeded");
};
seedUsers();

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  res.json({ token, role: user.role });
};
