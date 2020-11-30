const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  product: {
    type: Number,
  },
  status: {
    type: String,
    enum: ["CREATED", "VERIFIED", "CAPTURED"],
    required: true,
  },
});

module.exports = mongoose.model("Order", OrderSchema);
