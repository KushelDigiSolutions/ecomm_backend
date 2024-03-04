const Product = require("../models/productModel");
const { uploadToCloudinary } = require("../utils/imageUploader");
const SubCategory = require("../models/productSubCategory");
const Category = require("../models/productcategory");

// create product

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, subCategoryId } = req.body;

    const thumbnail = req.files.thumbnail;

    const userId = req.user.id;

    if (!title || !description || !price || !thumbnail || !subCategoryId) {
      return res.status(403).json({
        success: false,
        message: "all fields are required",
      });
    }

    //   see the category is valid or not
    const subCategoryDetails = await SubCategory.findOne({
      _id: subCategoryId,
    });

    if (!subCategoryDetails) {
      return res.status(404).json({
        success: false,
        message: "sub category details not found ",
      });
    }

    // upload to cloudinary
    const image = await uploadToCloudinary(
      thumbnail[0],
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    const product = await Product.create({
      title,
      description,
      price,
      thumbnail: image.secure_url,
      postedBy: userId,
      subCategory: subCategoryDetails._id,
    });

    // add course entry in Category => because us Category ke inside sare course aa jaye
    await SubCategory.findByIdAndUpdate(
      { _id: subCategoryDetails._id },
      {
        $push: {
          products: product._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "successfuly created the product ",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error in creating product",
    });
  }
};

// update product
exports.updateProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    const thumbnail = req.files?.thumbnail;

    const { productId } = req.params;

    if (!productId) {
      return res.status(403).json({
        success: false,
        message: "please send the product ID",
      });
    }

    //   check product id exist or not
    const productDetails = await Product.findById({ _id: productId });

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "product do not exist with this product ID",
      });
    }

    //   product ID is valid
    if (title) {
      productDetails.title = title;
    }

    if (description) {
      productDetails.description = description;
    }

    if (price) {
      productDetails.price = price;
    }

    if (thumbnail) {
      // upload to cloudinary
      const image = await uploadToCloudinary(
        thumbnail[0],
        process.env.FOLDER_NAME,
        1000,
        1000
      );

      productDetails.thumbnail = image.secure_url;
    }

    await productDetails.save();

    return res.status(200).json({
      success: true,
      message: "Product details update successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "internal server error in updating product",
    });
  }
};

// delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { productID } = req.params;

    if (!productID) {
      return res.status(403).json({
        success: false,
        message: "please send product ID",
      });
    }

    // delete the product from the sub Category
    const productDetails = await Product.findById({ _id: productID });

    // REMOVE THE ITEM FROM CATEGORY
    const subCategoryId = productDetails.subCategory;

    await SubCategory.findByIdAndUpdate(
      { _id: subCategoryId },
      { $pull: { products: productID } }
    );

    // delete the product
    await Product.findByIdAndDelete({ _id: productID });

    return res.status(200).json({
      success: true,
      message: "product deleted successfully ",
      productDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Delete product unsuccessfull , please try againb",
    });
  }
};

// fetch all products
exports.fetchAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find({}).populate("subCategory");

    return res.status(200).json({
      success: true,
      message: "successfuly all products",
      allProducts,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error in fetch all products ",
    });
  }
};

// get product by id
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res.status(403).json({
        success: false,
        message: "please send the product Id ",
      });
    }

    const productDetails = await Product.findOne({ _id: productId });

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "no product found with this id ",
      });
    }

    return res.status(200).json({
      success: true,
      message: "successfuly fetch the product Details",
      data: productDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "internal server error in get product by id",
    });
  }
};

exports.totalProduct = async (req, res) => {
  try {
    const AllProduct = await Product.find({});

    return res.status(200).json({
      success: true,
      AllProduct,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error ",
    });
  }
};

exports.productQuantity = async (req, res) => {
  try {
    const { change } = req.body;
    console.log("cange");

    const { productId } = req.params;

    console.log("id", productId);

    const ProductDetail = await Product.findById(productId);
    console.log("ProductDetail", ProductDetail);

    if (change === "increment") {
      ProductDetail.quantity += 1;
    } else if (change === "decrement") {
      if (ProductDetail.quantity > 0) {
        ProductDetail.quantity -= 1;
      }
    }

    await ProductDetail.save();

    return res.status(200).json({
      success: true,
      message: "Succesfuly done",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title) {
      return res.status(422).json({
        success: false,
        message: "Title is required for category creation",
      });
    }

    const category = await Category.create({ title });

    return res.status(201).json({
      success: true,
      message: "Category successfully created",
      category,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in creating category",
      error: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByIdAndDelete(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category successfully deleted",
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in deleting category",
    });
  }
};

exports.showAllCategory = async (req, res) => {
  try {
    const categories = await Category.find();

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in fetching categories",
    });
  }
};

exports.fetchCategoryPageDetail = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId).populate({
      path: "subCategory",
      populate: {
        path: "products",
        model: "Product",
      },
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in fetching category details",
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { title },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category successfully updated",
      category: updatedCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in updating category",
    });
  }
};

exports.createSubCategory = async (req, res) => {
  try {
    const { title, categoryId } = req.body;

    if (!title || !categoryId) {
      return res.status(403).json({
        success: false,
        message: "All fields are required",
      });
    }

    const categoryDetails = await Category.findOne({ _id: categoryId });

    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    const subCategory = await SubCategory.create({
      title,
      category: categoryDetails._id,
    });

    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          subCategory: subCategory._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully created the sub-category",
      subCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in creating sub-category",
    });
  }
};

exports.fetchAllSubCategoryOfCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId;

    const subCategories = await SubCategory.find({ category: categoryId });

    return res.status(200).json({
      success: true,
      subCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in fetching sub-categories",
    });
  }
};

exports.subCategoryPageDetails = async (req, res) => {
  try {
    const subCategoryId = req.params.subCategoryId;

    const subCategoryDetails = await SubCategory.findById(
      subCategoryId
    ).populate("products");

    if (!subCategoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Sub-category details not found",
      });
    }

    return res.status(200).json({
      success: true,
      subCategoryDetails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in fetching sub-category details",
    });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategoryId = req.params.subCategoryId;

    // Delete the specified sub-category
    const deletedSubCategory = await SubCategory.findByIdAndDelete(
      subCategoryId
    );

    if (!deletedSubCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found",
      });
    }

    await Category.findByIdAndUpdate(
      { _id: deletedSubCategory.category },
      {
        $pull: {
          subCategory: subCategoryId,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Successfully deleted the sub-category",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in deleting sub-category",
    });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const subCategoryId = req.params.subCategoryId;
    const { title } = req.body;

    if (!title) {
      return res.status(403).json({
        success: false,
        message: "Title is required",
      });
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      subCategoryId,
      { title },
      { new: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({
        success: false,
        message: "Sub-category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully updated the sub-category",
      updatedSubCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error in updating sub-category",
    });
  }
};
