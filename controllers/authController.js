import db from "../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql =
      "INSERT INTO users_auth (username, email, password) VALUES (?, ?, ?)";
    const values = [username, email, hashedPassword];

    db.query(sql, values, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({
          error: "Database error",
        });
      } else {
        res.redirect("/login");
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = "SELECT * FROM users_auth WHERE email = ?";
    const values = [email];

    db.query(sql, values, async (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = result[0];
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.cookie("token", token, { httpOnly: true });

      res.redirect("/dashboard");
    });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
};
