import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";

// Function For add Product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      brand,
      description,
      price,
      category,
      subCategory,
      sizes,
      watchGrade,
      offerPrice,
      discount,
      bestseller,
      quantity,
    } = req.body;

    // Images
    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];
    const image5 = req.files.image5 && req.files.image5[0];
    const image6 = req.files.image6 && req.files.image6[0];

    const images = [image1, image2, image3, image4, image5, image6].filter(
      (item) => item !== undefined
    );

    // Cloudinary Upload
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    // Parse Sizes
    let parsedSizes;
    try {
      parsedSizes = sizes ? JSON.parse(sizes) : [];
    } catch (e) {
      parsedSizes = [];
    }

    const productData = {
      name,
      brand,
      description,
      category,
      price: Number(price),
      quantity: Number(quantity),
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: parsedSizes,
      image: imagesUrl,
      date: Date.now(),
      offerPrice: offerPrice ? Number(offerPrice) : 0,
      discount: discount ? Number(discount) : 0,
      watchGrade: watchGrade || "Original",
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log("Error in addProduct:", error);
    res.json({ success: false, message: error.message });
  }
};

// Function For list Product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function For remove Product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function For single Product Info
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function to Update Quantity
const updateQuantity = async (req, res) => {
  try {
    const { id, quantity } = req.body;
    const newQuantity = Math.max(0, Number(quantity));

    const product = await productModel.findByIdAndUpdate(
      id,
      { quantity: newQuantity },
      { new: true }
    );

    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Quantity Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error updating quantity" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const {
      id,
      name,
      brand,
      description,
      price,
      offerPrice,
      category,
      subCategory,
      sizes,
      bestseller,
      watchGrade,
      quantity,
    } = req.body;

    const product = await productModel.findById(id);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    let updatedImages = [...product.image];

    const imageIndexes = req.body.imageIndexes
      ? JSON.parse(req.body.imageIndexes)
      : [];

    if (req.files && req.files.length > 0) {
      const newImagesUrls = await Promise.all(
        req.files.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
      newImagesUrls.forEach((url, i) => {
        const indexToReplace = parseInt(imageIndexes[i]);
        updatedImages[indexToReplace] = url;
      });
    }

    const updateData = {
      name,
      brand,
      description,
      price: Number(price),
      offerPrice: offerPrice === "" ? 0 : Number(offerPrice),
      category,
      subCategory,
      quantity: Number(quantity),
      bestseller: bestseller === "true",
      sizes: JSON.parse(sizes),
      image: updatedImages,
    };

    if (category === "Watch" && watchGrade) {
      updateData.watchGrade = watchGrade;
    }

    await productModel.findByIdAndUpdate(id, updateData);

    res.json({ success: true, message: "Product Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  listProducts,
  addProduct,
  removeProduct,
  singleProduct,
  updateQuantity,
  updateProduct,
};
