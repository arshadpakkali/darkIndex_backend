var express = require("express");
// const User = require("../models/users");
var Razorpay = require("razorpay");
var router = express.Router();
const Orders = require("../models/orders");
const crypto = require("crypto");
const User = require("../models/users");

let instance = new Razorpay({
  key_id: "rzp_test_J9bCZI7rvK4nYI",
  key_secret: "QgAiKpB4MwGfVIk4rHGSo6Ev",
});

router.post("/order", async (req, res) => {
  try {
    console.log(req.body);
    let options = req.body;
    let order = await instance.orders.create(options);
    await Orders.create({
      order_id: order.id,
      user_id: req.user._id,
      status: "CREATED",
    });
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: "Server Error" });
  }
});

router.get("/verify", async (req, res) => {
  try {
    console.log(req.query);
    let {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      subscription,
    } = req.query;

    let hash = razorpay_order_id + "|" + razorpay_payment_id;
    let expectedSignature = crypto
      .createHmac("sha256", instance.key_secret)
      .update(hash.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      await Orders.update(
        { order_id: razorpay_order_id },
        { status: "VERIFIED" }
      );
      await User.update({ _id: req.user._id }, { subscription: subscription });
      console.log("verified");
      res.json({ message: "payment Verified" });
    } else {
      console.log("Signature Not Verified");
      res.status(501).json({ message: "Payment Invalid Signature" });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
