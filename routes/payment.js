var express = require("express");
// const User = require("../models/users");
// const jwt = require("jsonwebtoken");
// const passport = require("passport");
var Razorpay = require("razorpay");
var router = express.Router();

let instance = new Razorpay({
  key_id: "rzp_test_J9bCZI7rvK4nYI",
  key_secret: "QgAiKpB4MwGfVIk4rHGSo6Ev",
});

router.post("/order", async (req, res) => {
  try {
    let options = req.body;
    console.log(options);
    let order = await instance.orders.create(options);
    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(501).json({ message: "Server Error" });
  }
});

module.exports = router;
