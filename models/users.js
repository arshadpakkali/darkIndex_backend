const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new Schema({
  firstName: { type: String, lowercase: true },
  lastName: { type: String, lowercase: true },
  email: { type: String, unique: true, required: true, lowercase: true },
  phoneNumber: { type: Number, unique: true },
  password: { type: String, required: true },
  subscription: { type: Number },
  creationDate: Date,
});

UserSchema.pre("save", async function (next) {
  console.log(this);
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  this.creationDate = new Date();
  next();
});
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

const User = model("User", UserSchema);
module.exports = User;
