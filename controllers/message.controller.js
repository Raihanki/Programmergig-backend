import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const store = async (req, res) => {
  const data = {
    conversationId: req.params.id,
    userId: req.user._id.toString(),
    message: req.body.message,
  };

  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    if (
      req.user.isSeller
        ? conversation.sellerId !== req.user._id.toString()
        : conversation.buyerId !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const result = await Message.create(data);
    await Conversation.findOneAndUpdate(
      { _id: req.params.id },
      {
        lastMessage: req.body.message,
        readBySeller: req.user.isSeller ? true : false,
        readByBuyer: req.user.isSeller ? false : true,
      }
    );
    return res.status(201).json({ data: result });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const index = async (req, res) => {
  try {
    const results = await Message.find({ conversationId: req.params.id });
    const conversation = await Conversation.findOne({ _id: req.params.id });
    if (
      req.user.isSeller
        ? conversation.sellerId !== req.user._id.toString()
        : conversation.buyerId !== req.user._id.toString()
    ) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({ data: results });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
