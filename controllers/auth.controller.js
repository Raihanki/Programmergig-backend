import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";

export const register = async (req, res) => {
  try {
    //   store image to cloudinary
    const file = req.files.image;
    const uploadFile = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "ProgrammerGig/ProfilePicture",
    });

    const data = {
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      password_confirmation: req.body.password_confirmation,
      country: req.body.country,
      isSeller: req.body.isSeller || false,
      image: uploadFile.secure_url,
      imagePublicId: uploadFile.public_id,
    };

    const hashedPassword = await bcrypt.hash(data.password, 10);
    data.password = hashedPassword;

    await User.create(data);

    return res.status(201).json({ message: "Successfully Registered" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const login = async (req, res) => {
  const data = {
    email: req.body.email,
    password: req.body.password,
  };

  try {
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(422).json({ message: "Invalid Credentials" });
    }

    const verifyPassword = await bcrypt.compare(data.password, user.password);
    if (!verifyPassword)
      return res.status(422).json({ message: "Invalid Credentials" });

    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller },
      process.env.JWT_SECRET
    );

    return res
      .cookie("accesstoken", token, { httpOnly: true })
      .json({ message: "Successfully Logged In" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const logout = async (req, res) => {
  return res
    .clearCookie("accesstoken")
    .json({ message: "Successfully Logged Out" });
};
