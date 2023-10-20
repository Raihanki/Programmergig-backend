import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";

export const store = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: "id not valid" });
  }

  if (req.user.isSeller === true) {
    return res.status(400).json({ message: "You are not allowed to order" });
  }

  const gig = await Gig.findById(req.params.id);
  if (!gig) {
    return res.status(404).json({ message: "Gig not found" });
  }

  const data = {
    gigId: gig._id.toString(),
    image: gig.coverImage,
    imagePublicId: gig.coverImagePublicId,
    title: gig.title,
    price: gig.price,
    sellerId: gig.userId,
    buyerId: req.user._id.toString(),
    paymentIntent: "todonexttime",
  };

  const results = await Order.create(data);
  return res.status(201).json({ data: results });
};

export const index = async (req, res) => {
  const filterCompleted = req.query.completed || false;
  try {
    const data = await Order.find({
      deletedAt: { $eq: null },
      ...(req.user.isSeller === true
        ? { sellerId: req.user._id.toString() }
        : { buyerId: req.user._id.toString() }),
      isCompleted: filterCompleted,
    });

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
