import { body, validationResult } from "express-validator";
import User from "../models/user.model.js";

export const userValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .custom(async (value) => {
      const user = await User.find({ username: value });
      if (user.length > 0) {
        throw new Error("Username already in use");
      }
    }),
  body("email")
    .isEmail()
    .withMessage("Email is not valid")
    .notEmpty()
    .withMessage("Email is required")
    .custom(async (value) => {
      const user = await User.find({ email: value });
      if (user.length > 0) {
        throw new Error("Email already in use");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("password_confirmation")
    .notEmpty()
    .withMessage("Password confirmation is required")
    .equals("password")
    .withMessage("Password confirmation does not match"),
  body("country").notEmpty().withMessage("Country is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array() });
    }
    next();
  },
];
