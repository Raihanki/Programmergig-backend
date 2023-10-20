import Gig from "../models/gig.model.js";
import Conversation from "../models/conversation.model.js";

export const index = async (req, res) => {
  try {
    const results = await Conversation.find(
      req.user.isSeller
        ? { sellerId: req.user._id.toString() }
        : { buyerId: req.user._id.toString() }
    );
    return res.status(200).json({ data: results });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const store = async (req, res) => {
  const to = req.body.to;
  const id = req.params.gigId;

  try {
    const gig = await Gig.findById(id);
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    const data = {
      gigId: gig._id.toString(),
      sellerId: req.user.isSeller ? req.user._id.toString() : to,
      buyerId: req.user.isSeller ? to : req.user._id.toString(),
      readBySeller: req.user.isSeller ? true : false,
      readByBuyer: req.user.isSeller ? false : true,
    };

    const results = await Conversation.create(data);
    return res.status(201).json({ data: results });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const show = async (req, res) => {
  try {
    const result = await Conversation.findOne({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: "Conversation not found" });
    }
    return res.status(200).json({ data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const data = await Conversation.findOneAndUpdate(
      { _id: req.params.id },
      { readBySeller: true, readByBuyer: true },
      { new: true }
    );
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
