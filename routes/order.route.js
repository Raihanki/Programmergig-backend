import express from "express";
import { index, store } from "../controllers/order.controller.js";
import { authenticated } from "../middleware/authenticated.js";

const router = express.Router();

router.get("/", authenticated, index);
router.post("/:id", authenticated, store);

export default router;
