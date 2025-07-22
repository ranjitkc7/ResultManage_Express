import db from "../models/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  const { username, email, password, confirmpassword } = req.body;

  if (password !== confirmpassword) {
    return res.render("signUp", {
      error: "Passwords do not match",
    });
  }
  if(!username || !email || !password || !confirmpassword){
    return res.render("signUp", {
      error: "All fields are required",
    });
  }
  const checkUser = "SELECT * FROM users_auth WHERE email = ?";
  db.query(checkUser, [email], async (checkErr, result) => {
    if (checkErr) {
      console.log(checkErr);
      return res.status(500).render("signUp", {
        error: "Database error while checking user",
      });
    }
    if (result.length > 0) {
      return res.render("signUp", {
        error: "User already exists",
      });
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql =
        "INSERT INTO users_auth (username, email, password) VALUES (?, ?, ?)";
      const values = [username, email, hashedPassword];

      db.query(sql, values, (err, result) => {
        if (err) {
          console.log(err);
          return res.status(500).render("signUp", {
            error: "Signup failed",
          });
        } else {
          return res.redirect("/login");
        }
      });
    } catch (hashErr) {
      console.log(hashErr);
      return res.status(500).render("signUp", {
        error: "Error while hashing password",
      });
    }
  });
};

export const logIn = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.render("logIn", {
      error: "All fields are required",
    });
  }

  const checkUserLog = "SELECT * FROM users_auth WHERE email = ?";
  db.query(checkUserLog, [email], async (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).render("logIn", {
        error: "Database error while checking user",
      });
    }

    if (result.length === 0) {
      return res.render("logIn", {
        error: "User not found. Please sign up first.",
      });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("logIn", {
        error: "Invalid password. Please try again.",
      });
    }
    try {
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      res.cookie("token", token, { httpOnly: true });
      res.redirect("/dashboard");
    } catch (tokenError) {
      console.log(tokenError);
      res.status(500).render("logIn", {
        error: "Login failed. Please try again later.",
      });
    }
  });
};
