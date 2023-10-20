import express from "express";
import { destroy, index } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", index);
router.delete("/", destroy);

export default router;
