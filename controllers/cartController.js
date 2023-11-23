const Product = require("../models/productModel");

// add to cart
exports.addToCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const userId = req.user.id;

    if (!productId || !userId) {
      return res.status(403).json({
        success: false,
        message: "please send the productId",
      });
    }

    // check valid product ID or not
    const productDetails = await Product.findById(productId);

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "The product do not exist with this id ",
      });
    }

    await productDetails.cart.push(userId);
    await productDetails.save();

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in add to cart",
    });
  }
};

// remove from cart

exports.removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const userId = req.user.id;

    if (!productId || !userId) {
      return res.status(403).json({
        success: false,
        message: "please send the productId",
      });
    }

    // check valid product ID or not
    const productDetails = await Product.findById(productId);

    console.log("productDetails", productDetails);

    if (!productDetails) {
      return res.status(404).json({
        success: false,
        message: "The product do not exist with this id ",
      });
    }

    const indexToRemove = productDetails.cart ? productDetails.cart.indexOf(userId) : -1;

    if (indexToRemove !== -1) {
      productDetails.cart.splice(indexToRemove, 1);
      await productDetails.save();
      res.status(200).json({ message: "Product removed from cart successfully" });

    } else {
      res.status(404).json({ error: "User not found in the product's cart" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in remove cart , internal server error ",
    });
  }
};

// fetch all cart of login user
exports.fetchAllCartItem = async (req, res) => {
  try {
    const userId = req.user.id;

    if (!userId) {
      return res.status(403).json({
        success: false,
        message: "please send the userId",
      });
    }

    const cartItems = await Product.find({ cart: userId });

    res.status(200).json({ cartItems });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error in fetch all cart items " });
  }
};
