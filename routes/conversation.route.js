import express from "express";
import {
  index,
  show,
  store,
  update,
} from "../controllers/conversation.controller.js";
import { authenticated } from "../middleware/authenticated.js";
import { conversationRules } from "../validation/conversationValidation.js";

const router = express.Router();

router.get("/", authenticated, index);
router.post("/:gigId", [authenticated, conversationRules], store);
router.get("/:id", authenticated, show);
router.put("/:id", authenticated, update);

export default router;
