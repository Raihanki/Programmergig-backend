import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const authenticated = async (req, res, next) => {
  if (!req.cookies.accesstoken) {
    return res.status(401).json({ message: "Unauthenticated" });
  } else {
    try {
      const data = jwt.verify(req.cookies.accesstoken, process.env.JWT_SECRET);
      const user = await User.findOne({
        _id: data.id,
        deletedAt: { $eq: null },
      });
      const { password, ...info } = user._doc;
      req.user = info;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Unauthenticated" });
    }
  }
};
