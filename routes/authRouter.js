import { Router } from "express";
import { signUp, logIn } from "../controllers/authController.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("signUp");
});
router.post("/signUp", signUp);

router.get("/login", (req, res) => {
  res.render("logIn");
});
router.post("/login", logIn);

export const authRouter = router;
