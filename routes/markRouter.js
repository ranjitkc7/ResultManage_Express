import { Router } from "express";
import { submitMarks } from "../controllers/markController.js";

const router = Router();

router.get("/submit-marks", (req, res) => {
    res.render("dashboard");
})
router.post("/submit-marks", submitMarks);

export const markRouter = router;