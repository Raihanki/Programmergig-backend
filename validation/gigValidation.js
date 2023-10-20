import { body, validationResult } from "express-validator";

export const gigValidation = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("price").notEmpty().withMessage("Price is required"),
  body("shortTitle").notEmpty().withMessage("Short Title is required"),
  body("shortDescription")
    .notEmpty()
    .withMessage("Short Description is required"),
  body("deliveryTime").notEmpty().withMessage("Delivery time is required"),
  body("revisionNumber").notEmpty().withMessage("Revision Number is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ message: errors.array() });
    }
    next();
  },
];
