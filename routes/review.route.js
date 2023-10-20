import express from "express";
import { create, index, destroy } from "../controllers/review.controller.js";
import { authenticated } from "../middleware/authenticated.js";
import { reviewValidation } from "../validation/reviewValidation.js";

const router = express.Router();

router.post("/", [authenticated, reviewValidation], create);
router.get("/:id", index);
router.delete("/:id", authenticated, destroy);

export default router;
