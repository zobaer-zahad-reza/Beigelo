import brandModel from "../models/brandModel.js";
import { v2 as cloudinary } from "cloudinary";

//Add Brand
const addBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const imageFile = req.file;

    // Check if file exists
    if (!imageFile) {
      return res.json({ success: false, message: "Image is required" });
    }

    // Upload image to Cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
      resource_type: "image",
    });

    const brandData = {
      name,
      image: imageUpload.secure_url,
    };

    const brand = new brandModel(brandData);
    await brand.save();

    res.json({ success: true, message: "Brand Added Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//List Brands
const listBrands = async (req, res) => {
  try {
    const brands = await brandModel.find({});
    res.json({ success: true, brands });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addBrand, listBrands };
