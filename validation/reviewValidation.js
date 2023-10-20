import { body, validationResult } from "express-validator";
import Gig from "../models/gig.model.js";

export const reviewValidation = [
  body("gigId")
    .notEmpty()
    .withMessage("Gig Id is required")
    .custom(async (value) => {
      const gig = Gig.find({ _id: value });
      if (!gig) {
        throw new Error("Gig not found");
      }
    }),
  body("star")
    .notEmpty()
    .withMessage("Star is required")
    .isNumeric()
    .withMessage("Star must be a number")
    .isLength({ min: 1, max: 5 })
    .withMessage("Star must be between 1 and 5"),
  body("description").notEmpty().withMessage("Description is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array() });
    }
    next();
  },
];
