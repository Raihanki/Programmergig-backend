import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    gigId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    imagePublicId: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
    paymentIntent: {
      type: String,
      required: true,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Order", orderSchema);
