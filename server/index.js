"use strict";

const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const {
  getFilteredItems,
  getCompanies,
  getProductInformation,
  addOrder,
  getPastOrders,
  getPastOrder,
  getUser,
  deleteUser,
  updateUser,
  getCompany,
  userSignup,
  userSignin,
  userSignout,
  getLoggedInUser,
  updateCart,
} = require("./handlers");

const { requireAuth } = require("./authMiddleware");

const PORT = 4000;

express()
  .use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Methods",
      "OPTIONS, HEAD, GET, PUT, POST, DELETE"
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("./server/assets"))
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .use("/", express.static(__dirname + "/"))
  .use(cookieParser())

  // REST endpoints?
  .get("/get-filtered-items", getFilteredItems)
  .get("/get-companies", getCompanies)
  .get("/get-product-info/:_id", getProductInformation)
  .get("/get-pastorders/:email", getPastOrders)
  .get("/get-pastorder/:_id", getPastOrder)
  .post("/place-order/", addOrder)
  .get("/get-user/:_id", getUser)
  .patch("/update-user", updateUser)
  .delete("/delete-user/:_id", deleteUser)
  .get("/get-company/:_id", getCompany)
  .post("/signup", userSignup)
  .post("/signin", userSignin)
  .get("/verifyCookie", requireAuth)
  .get("/signout", userSignout)
  .get("/get-logged-in-user", getLoggedInUser)
  .patch("/update-cart/", updateCart)

  .get("*", (req, res) => {
    res.status(404).json({
      status: 404,
      message: "This is obviously not what you are looking for.",
    });
  })

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
