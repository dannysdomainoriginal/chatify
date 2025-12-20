import { signup } from "@/controllers/auth.controller";
import { Router } from "express";

const router = Router()

router.post("/signup", signup)

export default router