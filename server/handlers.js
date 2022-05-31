"use strict";
const assert = require("assert");
const { MongoClient, ObjectId } = require("mongodb");
const { format } = require("path");
const { validation } = require("./validation");
const {
  Authentication,
  handleErrors,
  createJWT,
  AddToUserDB,
} = require("./userAuthentication");
const jwt = require("jsonwebtoken");
const { JWTS } = process.env;

require("dotenv").config();

const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

//Allows the filtering of items using queries from the FE
const getFilteredItems = async (req, res) => {
  const filter = [req.query];
  const client = new MongoClient(MONGO_URI, options);
  let name = "";

  await client.connect();

  if (filter[0].name) {
    name = filter[0].name;
  }

  //Converts query string to int so that it matches database
  const formattedFilter = filter.map((f) => {
    if (f.companyId) {
      f.companyId = parseInt(f.companyId);
    }

    if (f.name) {
      delete f.name;
    }
    return f;
  });

  const db = client.db("shape_tech");

  const result = await db
    .collection("items")
    .find({
      $and: [formattedFilter[0], { name: { $regex: name, $options: "i" } }],
    })
    .toArray();

  if (result.length > 0) {
    res.status(200).json({
      status: 200,
      data: result,
      message: "Successfully retrieved all items",
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "No matching items found.",
    });
  }
};

//Handler for getting list of companies from db
const getCompanies = async (req, res) => {
  const client = new MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("shape_tech");
  const result = await db.collection("companies").find().toArray();

  if (result.length > 0) {
    res.status(200).json({
      status: 200,
      data: result,
      message: "Successfully retrieved all companies",
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "Could not retrieve companies",
    });
  }
};

//handler for product information when on product page with params
const getProductInformation = async (req, res) => {
  try {
    const client = await new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("shape_tech");
    //This will turn the string param into a number to be grabbed in the Mongo DB
    const _id = Number(req.params._id);
    await db.collection("items").findOne({ _id }, (err, result) => {
      result
        ? res.status(200).json({ status: 200, data: result })
        : res.status(400).json({
            status: 400,
            message: "Product information not found.",
          });
      client.close();
    });
  } catch (error) {
    res.status(400).json({ status: 400, message: "error" });
  }
};

// add a handler when a user buys a product and register user if not registered
// have to add ways to update order stock with ID's
// generate order number and user in collections
// validation checks on credit card and if a user is already registered in db

// this will register a customer to our database upon purchasing an order

const addOrder = async (req, res) => {
  const {
    nameOnCard,
    fullName,
    address,
    city,
    provState,
    postalZip,
    creditCardNumber,
    email,
    items,
    creditExpYear,
    creditExpMonth,
    country,
    cvc,
    shipping,
    tax,
    saveData,
    total,
  } = req.body;

  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("shape_tech");

  // running a validation function here to check if the information is valid in the user's body //
  const orderNumber = uuidv4();
  let errorMessage = await validation(req.body, orderNumber);

  const dataOrder = {
    _id: orderNumber,
    nameOnCard,
    fullName,
    address,
    city,
    provState,
    postalZip,
    creditCardNumber,
    email,
    items,
    creditExpYear,
    creditExpMonth,
    country,
    cvc,
    shipping,
    tax,
    total,
  };

  const userInformation = {
    orderNumbers: [orderNumber],
    nameOnCard,
    fullName,
    address,
    city,
    provState,
    postalZip,
    creditCardNumber,
    email,
    creditExpYear,
    creditExpMonth,
    country,
    cvc,
  };

  const itemsToUpdate = items;

  // these are the switch cases that will returned in the validation function, whichever validation check fails will return that string and execute that error res //

  switch (errorMessage) {
    case "invalid email":
      res.status(400).json({ status: 400, message: "Email address invalid!" });
      client.close();
      break;
    case "credit card invalid error":
      res
        .status(400)
        .json({ status: 400, message: "Credit card number invalid!" });
      client.close();
      break;
    case "expired credit":
      res.status(400).json({ status: 400, message: "Expiry date invalid!" });
      client.close();
      break;
    case "undeliverable":
      res
        .status(400)
        .json({ status: 400, message: "Location not available for shipment!" });
      client.close();
      break;
    case "user exists":
      await db.collection("orders").insertOne(dataOrder);
      res.status(200).json({
        status: 200,
        data: dataOrder,
        message: "Order is placed! Thank you for being a returning customer!",
      });
      client.close();
      break;
    case "cvc invalid":
      res
        .status(400)
        .json({ status: 400, message: "Entered invalid CVC code!" });
      client.close();
    case "":
      await db.collection("orders").insertOne(dataOrder);

      await Promise.all(
        itemsToUpdate.map(async (item) => {
          await db.collection("items").updateOne(
            { _id: item.itemDesc._id },
            {
              $inc: {
                numInStock: -item.selectedQuantity,
              },
            }
          );
        })
      );

      res.status(200).json({
        status: 200,
        data: dataOrder,
        message: "User has been registered and order has been placed!",
      });
      client.close();
      break;
    default:
      res.status(500).json({ status: 500, message: "Unexpected error!" });
      client.close();
  }
};

// this will get all past orders from a user who's made multiple orders//
const getPastOrders = async (req, res) => {
  const email = req.params;
  const client = await new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("shape_tech");

  try {
    const allPastOrders = [];
    const allOrders = await db.collection("orders").find(email).toArray();

    res.status(200).json({ status: 200, data: allOrders });
    client.close();
  } catch (error) {
    res.status(400).json({ status: 400, message: "Unexpected error!" });
  }
};

// this will get a single past order made by a user using req.params//
const getPastOrder = async (req, res) => {
  const _id = req.params._id;
  const client = await new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("shape_tech");

  try {
    const pastOrder = await db.collection("orders").findOne({ _id });
    res.status(200).json({
      status: 200,
      data: pastOrder,
      message: "Order succesfully retrieved!",
    });
    client.close();
  } catch (error) {
    res.status(400).json({ status: 400, message: "Unexpected error!" });
  }
};

//get a user
const getUser = async (req, res) => {
  const _id = req.params._id;
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("shape_tech");

  const result = await db.collection("users").findOne({ _id });

  if (result) {
    res.status(200).json({
      status: 200,
      data: { result },
      message: "Success ",
    });
  } else {
    res.status(404).json({
      status: 404,
      message: "failed",
    });
  }
};

//delete user
const deleteUser = async (req, res) => {
  const _id = req.params._id;
  const idString = _id.toString();
  const ObjectID = require("mongodb").ObjectId;

  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("shape_tech");
  const result = await db.collection("users").deleteOne({ _id: ObjectId(_id) });

  if (result.deletedCount !== 1) {
    return res.status(404).json({
      status: 404,
      message: "failed",
    });
  }
};
//editUser
const updateUser = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("shape_tech");

    const updateInfo = req.body;

    const fullName = updateInfo.fullName;
    const email = updateInfo.email;
    const address = updateInfo.address;
    const city = updateInfo.city;
    const provState = updateInfo.provState;
    const postalZip = updateInfo.postalZip;
    const creditCardNumber = updateInfo.creditCardNumber;
    const creditExpMonth = updateInfo.creditExpMonth;
    const creditExpYear = updateInfo.creditExpYear;
    const country = updateInfo.country;
    const cvc = updateInfo.cvc;
    const nameOnCard = updateInfo.nameOnCard;

    const updatedValues = {
      $set: {
        nameOnCard: { $exist: false },
        fullName: { $exist: false },
        address: { $exist: false },
        city: { $exist: false },
        provState: { $exist: false },
        postalZip: { $exist: false },
        creditCardNumber: { $exist: false },
        email: { $exist: false },
        creditExpYear: { $exist: false },
        creditExpMonth: { $exist: false },
        country: { $exist: false },
        cvc: { $exist: false },

        nameOnCard: nameOnCard,
        fullName: fullName,
        address: address,
        city: city,
        provState: provState,
        postalZip: postalZip,
        creditCardNumber: creditCardNumber,
        email: email,
        creditExpYear: creditExpYear,
        creditExpMonth: creditExpMonth,
        country: country,
        cvc: cvc,
      },
    };

    const result = await db
      .collection("users")
      .updateOne({ email }, updatedValues);

    if (result) {
      //result
      return res.status(200).json({
        status: 200,
        data: updatedValues,
        message: "Successful update",
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "does not exist",
      });
    }
  } catch (err) {
    res.status(404).json({
      status: 404,
      message: "does not exist",
    });
  }
};

const getCompany = async (req, res) => {
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("shape_tech");
    const _id = Number(req.params._id);
    db.collection("companies").findOne({ _id }, (err, result) => {
      result
        ? res.status(200).json({
            status: 200,
            data: result,
            message: "success",
          })
        : res.status(400).json({
            status: 400,
            message: "Not found!",
          });
    });
  } catch (err) {
    res.status(400).json({
      status: 400,
      message: "Error!",
    });
  }
};

const userSignup = async (req, res) => {
  const { email, password } = req.body;
  try {
    mongoose.connect(MONGO_URI, options);
    const user = await Authentication.create({ email, password });
    if (user) {
      AddToUserDB.create({ email });
    }
    const jwt = createJWT(user._id);
    res.cookie("jwt", jwt, { httpOnly: true, maxAge: 259200 * 1000 });
    res.status(201).json({
      status: 201,
      data: user._id,
      message: "user successfully created",
    });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({
      status: 400,
      errors: errors,
    });
  }
};

const userSignin = async (req, res) => {
  const { email, password } = req.body;
  try {
    mongoose.connect(MONGO_URI, options);
    const user = await Authentication.login(email, password);
    const jwt = createJWT(user._id);
    res.cookie("jwt", jwt, { httpOnly: true, maxAge: 259200 * 1000 });
    res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ status: 400, errors: errors });
  }
};

const userSignout = (req, res) => {
  res.cookie(`jwt`, "", { maxAge: 1 });

  res.status(200).json({ message: "logout successful" });
};

const getLoggedInUser = async (req, res) => {
  const token = req.cookies.jwt;

  let user;

  jwt.verify(token, JWTS, async (err, decodedToken) => {
    if (!err) {
      mongoose.connect(MONGO_URI, options);

      user = await Authentication.findById(decodedToken.id);

      const client = new MongoClient(MONGO_URI, options);
      await client.connect();
      const db = client.db("shape_tech");

      const result = await db
        .collection("users")
        .findOne({ email: user.email });

      return res.status(200).json({ status: 200, data: result });
    } else
      return res.status(404).json({ status: 404, message: "no session found" });
  });
};

const updateCart = async (req, res) => {
  const { email, cart } = req.body;
  try {
    const client = new MongoClient(MONGO_URI, options);
    await client.connect();
    const db = client.db("shape_tech");

    const updateCart = await db
      .collection("users")
      .updateOne({ email: email }, { $set: { cart } });

    if (updateCart.modifiedCount === 1) {
      res.status(200).json({ status: 200, message: "User cart updated" });
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: "Could not update your cart. Please try again." });
  }
};

module.exports = {
  getFilteredItems,
  getCompanies,
  getProductInformation,
  addOrder,
  getPastOrders,
  getPastOrder,
  getUser,
  updateUser,
  deleteUser,
  getCompany,
  userSignup,
  userSignin,
  userSignout,
  getLoggedInUser,
  updateCart,
};
