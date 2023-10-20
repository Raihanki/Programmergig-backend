import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";

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

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const payment = await stripe.paymentIntents.create({
    amount: gig.price * 100,
    currency: "usd",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  const data = {
    gigId: gig._id.toString(),
    image: gig.coverImage,
    imagePublicId: gig.coverImagePublicId,
    title: gig.title,
    price: gig.price,
    sellerId: gig.userId,
    buyerId: req.user._id.toString(),
    paymentIntent: payment.id,
  };

  await Order.create(data);
  return res.status(201).json({ client_secret: payment.client_secret });
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

export const update = async (req, res) => {
  try {
    const paymentIntent = req.body.payment_intent;
    const order = await Order.findOneAndUpdate(
      { paymentIntent },
      { isCompleted: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res.status(200).json({ message: "Order Completed" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
