import express from "express";
import { index, show, store } from "../controllers/gig.controller.js";
import { authenticated } from "../middleware/authenticated.js";
import { gigValidation } from "../validation/gigValidation.js";

const router = express.Router();

router.get("/", index);
router.get("/:slug", show);
router.post("/", [authenticated, gigValidation], store);

export default router;
