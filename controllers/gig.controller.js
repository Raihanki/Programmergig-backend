import { v2 as cloudinary } from "cloudinary";
import Gig from "../models/gig.model.js";
import slug from "slug";

export const index = async (req, res) => {
  try {
    const gigs = await Gig.find({ deletedAt: { $eq: null } });
    return res.status(200).json({
      data: gigs,
    });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

export const show = async (req, res) => {
  try {
    const params = req.params.slug;
    const gig = await Gig.findOne({ slug: params, deletedAt: { $eq: null } });
    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    return res.status(200).json({ data: gig });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const store = async (req, res) => {
  if (req.user.isSeller === false) {
    return res
      .status(400)
      .json({ message: "You are not allowed to create gig" });
  }

  let uploadFileCoverImage;
  try {
    if (req.files?.coverImage !== undefined) {
      const fileCoverImage = req.files.coverImage;
      uploadFileCoverImage = await cloudinary.uploader.upload(
        fileCoverImage.tempFilePath,
        {
          folder: "ProgrammerGig/Gig/Cover",
        }
      );
    } else {
      return res.status(400).json({ message: "Cover image is required" });
    }

    const uploadFiles = [];
    if (req.files?.images !== undefined) {
      const images = req.files.images;
      for (let i = 0; i < images.length; i++) {
        const uploadFile = await cloudinary.uploader.upload(
          images[i].tempFilePath,
          {
            folder: "ProgrammerGig/Gig/Images",
          }
        );
        uploadFiles.push(uploadFile);
      }
    }

    const title = req.body.title;
    const data = {
      userId: req.user._id,
      title: title,
      slug: slug(title, { lower: true }),
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      shortTitle: req.body.shortTitle,
      shortDescription: req.body.shortDescription,
      deliveryTime: req.body.deliveryTime,
      revisionNumber: req.body.revisionNumber,
      features: req.body.features || [],
      coverImage: uploadFileCoverImage.secure_url,
      coverImagePublicId: uploadFileCoverImage.public_id,
      images: uploadFiles.map((file) => file.secure_url),
      imagesPublicId: uploadFiles.map((file) => file.public_id || null),
    };

    await Gig.create(data);

    return res.status(201).json({ message: "Successfully created" });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: err.message });
  }
};
