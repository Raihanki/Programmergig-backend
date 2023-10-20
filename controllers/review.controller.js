import Gig from "../models/gig.model.js";
import Review from "../models/review.model.js";

export const create = async (req, res) => {
  if (req.user.isSeller === true) {
    return res.status(400).json({ message: "You are not allowed to review" });
  }

  const data = {
    gigId: req.body.gigId,
    userId: req.user._id,
    star: req.body.star,
    description: req.body.description,
  };

  try {
    const checkReview = await Review.findOne({
      gigId: data.gigId,
      userId: data.userId,
    });
    if (checkReview) {
      return res
        .status(400)
        .json({ message: "You already send a review to this gig" });
    }

    const results = await Review.create(data);
    await Gig.findByIdAndUpdate(data.gigId, {
      $inc: { totalStars: data.star, starNumber: 1 },
    });

    return res.status(201).json({ data: results });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const index = async (req, res) => {
  try {
    const data = await Review.find({
      deletedAt: { $eq: null },
      gigId: req.params.id,
    });
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const destroy = async (req, res) => {
  try {
    const id = req.params.id;
    const review = await Review.findById(id);

    if (review.userId !== req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "You are not allowed to delete this review" });
    }

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    await Review.updateOne(
      { _id: id },
      {
        $set: {
          deletedAt: Date.now(),
        },
      }
    );

    await Gig.findByIdAndUpdate(review.gigId, {
      $inc: { totalStars: -review.star, starNumber: -1 },
    });

    return res.status(200).json({ message: "Successfully Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
