import productModel from "../models/productModel.js";

// Function For Add Product
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

    const files = req.files || {};

    const image1 = files.image1 && files.image1[0];
    const image2 = files.image2 && files.image2[0];
    const image3 = files.image3 && files.image3[0];
    const image4 = files.image4 && files.image4[0];
    const image5 = files.image5 && files.image5[0];
    const image6 = files.image6 && files.image6[0];

    const images = [image1, image2, image3, image4, image5, image6].filter(
      (item) => item !== undefined
    );

    let imagesUrl = images.map((item) => item.path);

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
      image: imagesUrl, // Cloudinary URLs
      date: Date.now(),
      offerPrice: offerPrice ? Number(offerPrice) : 0,
      discount: discount ? Number(discount) : 0,
      watchGrade: watchGrade || "Original",
    };

    const product = new productModel(productData);
    await product.save();

    res.json({ success: true, message: "Product Added Successfully" });
  } catch (error) {
    console.log("Error in addProduct:", error);
    res.json({ success: false, message: error.message });
  }
};

// Function For List Product
const listProducts = async (req, res) => {
  try {
    const products = await productModel.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function For Remove Product
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Function For Single Product Info
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

// Function for Update Product
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
      const newImagesUrls = req.files.map((item) => item.path);

      newImagesUrls.forEach((url, i) => {
        const indexToReplace = parseInt(imageIndexes[i]);
        if (!isNaN(indexToReplace)) {
          updatedImages[indexToReplace] = url;
        }
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

// Function For Remove Specific Image
const removeImage = async (req, res) => {
  try {
    const { productId, imageUrl } = req.body;

    const product = await productModel.findById(productId);
    if (!product) {
      return res.json({ success: false, message: "Product not found" });
    }

    const updatedImages = product.image.filter((img) => img !== imageUrl);

    // Database e update kora
    await productModel.findByIdAndUpdate(productId, { image: updatedImages });

    res.json({ success: true, message: "Image Removed Successfully" });
  } catch (error) {
    console.log("Error in removeImage:", error);
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
  removeImage,
};