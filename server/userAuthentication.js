const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { JWTS } = process.env;

//error handling for mongoose schema
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  //duplicate email error
  if (err.code === 11000) {
    errors.email = "This email is already registered";
    return errors;
  }

  //incorrect email
  if (err.message === "incorrect email") {
    errors.email = "Email does not exist";
  }

  //incorrect password
  if (err.message === "incorrect password") {
    errors.password = "Password is incorrect";
  }

  //validation errors
  if (err.message.includes("login validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }
  return errors;
};

//creates jsonwebtoken which expires after 3 days
const createJWT = (id) => {
  return jwt.sign({ id }, JWTS, { expiresIn: 259200 });
};

//mongoose schema for user signup
const authenticationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please enter an email"],
    unique: true,
    lowerCase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    minlength: [10, "Minimum password length is 10 characters"],
    required: [true, "Please enter a password"],
  },
});

//function to hash password before document gets saved to db
authenticationSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

authenticationSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });

  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error("incorrect password");
  }
  throw Error("incorrect email");
};

//schema for pushing non-sensitive registered user data to users database
const userDetailsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowerCase: true,
    validate: isEmail,
  },
  cart: {
    type: Array,
  },
});

userDetailsSchema.statics.getDetails = async function (email) {
  const user = await this.findOne({ email });

  if (user) {
    return user;
  }
};

const Authentication = mongoose.model("login", authenticationSchema);

const AddToUserDB = mongoose.model("user", userDetailsSchema);

module.exports = { Authentication, handleErrors, createJWT, AddToUserDB };
