import { body, validationResult } from "express-validator";

export const conversationRules = [
  body("to").notEmpty().withMessage("To is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array() });
    }
    next();
  },
];
