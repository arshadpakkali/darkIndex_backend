var express = require("express");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const passport = require("passport");
var router = express.Router();

/* GET users listing. */
router.get("/", passport.authenticate("jwt", { session: false }), function (
  req,
  res
) {
  res.json("respond with a resource");
});

router.post("/login", async (req, res, next) => {
  passport.authenticate("login", async (err, user, options) => {
    console.log(err, user, options);
    try {
      if (err) {
        return next(options);
      }
      if (!user) {
        return res.status(401).send(options);
      }
      req.login(user, { session: false }, async (error) => {
        if (error) return next(error);
        const body = { _id: user._id, email: user.email };
        const token = jwt.sign({ user: body }, "INDEX*DARK", {
          expiresIn: "1h",
        });
        return res.json({ id_token: token, expires_at: "1" });
      });
    } catch (error) {
      return next(error);
    }
  })(req, res, next);
});

router.post("/register", async (req, res) => {
  try {
    let user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      creationDate: new Date(),
    });
    res.json({ message: "Registration Successfull", user: user });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
