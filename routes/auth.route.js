import express from "express";
import { login, logout, register } from "../controllers/auth.controller.js";
import { userValidation } from "../validation/UserValidation.js";
import { authenticated } from "../middleware/authenticated.js";

const router = express.Router();

router.post("/register", userValidation, register);
router.post("/login", login);
router.post("/logout", authenticated, logout);

export default router;
