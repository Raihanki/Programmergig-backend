import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";

export const index = (req, res) => {
  return res.status(200).json({ data: req.user });
};

export const destroy = async (req, res) => {
  try {
    const id = req.user._id;
    await cloudinary.uploader.destroy(req.user.imagePublicId);
    await User.updateOne(
      { _id: id },
      {
        $set: {
          deletedAt: Date.now(),
        },
      }
    );

    return res
      .clearCookie("accesstoken")
      .status(200)
      .json({ message: "Successfully Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
