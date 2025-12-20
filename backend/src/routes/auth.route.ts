import { login, logout, signup, updateProfile } from "@/controllers/auth.controller";
import { Router } from "express";
import { protectRoute } from "@/middlewares/auth.middleware";

const router = Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)
router.put("/update-profile", protectRoute, updateProfile)

// auth check route
router.get("/check", protectRoute, (req, res) => res.status(200).json(req.user))

export default router