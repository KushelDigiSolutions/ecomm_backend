const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  images: {
    type: String,
  },
  subCategory: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "subCategory",
    },
  ],
});

module.exports = mongoose.model("Category", categorySchema);
