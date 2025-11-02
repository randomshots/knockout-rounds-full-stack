import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";

const router = express.Router();

router.get("/protected", verifyToken, (req, res) => {
  res.json({
    message: `Welcome ${req.user.username}, you accessed a protected route!`,
  });
});

export default router;
