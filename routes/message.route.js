import express from "express";
import { authenticated } from "../middleware/authenticated.js";
import { index, store } from "../controllers/message.controller.js";
import { messageRules } from "../validation/messageValidation.js";

const router = express.Router();

router.post("/:id", [authenticated, messageRules], store);
router.get("/:id", authenticated, index);

export default router;
