import * as authController from "@/controllers/auth.controller";
import { Router } from "express";
import { protectRoute } from "@/middlewares/auth.middleware";
import { arcjectProtection } from "@/middlewares/arcjet.middleware";

const router = Router();

// router.use(arcjectProtection);

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.put("/update-profile", protectRoute, authController.updateProfile);

// auth check route
router.get("/check", protectRoute, (req, res) =>
  res.status(200).json(req.user)
);

export default router;
