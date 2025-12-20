import { login, logout, signup } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router()

router.post("/signup", signup)
router.post("/login", login)
router.post("/logout", logout)

export default router