const moment = require("moment");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

// this is a validation check that will run in our handlers to ensure data is valid
const validation = async (body, orderNumber) => {
  const email = body.email;
  const fullName = body.fullName;
  const country = body.country;
  const address = body.address;
  const city = body.city;
  const provState = body.provState;
  const postalZip = body.postalZip;
  const nameOnCard = body.nameOnCard;
  const creditCardNumber = body.creditCardNumber;
  const creditExpMonth = body.creditExpMonth;
  const creditExpYear = body.creditExpYear;
  const cvc = body.cvc;
  const saveData = body.saveData;

  const validCountries = [
    "usa",
    "us",
    "canada",
    "america",
    "united states of america",
    "ca",
  ];
  const client = new MongoClient(MONGO_URI, options);
  await client.connect();
  const db = client.db("shape_tech");
  const user = await db.collection("users").findOne({ email });
  if (!body.email.includes("@")) {
    return "invalid email";
  }
  if (!validCountries.includes(body.country.toLowerCase())) {
    return "undeliverable";
  }
  if (cvc.length !== 3) {
    return "cvc invalid";
  }
  if (body.creditCardNumber.length !== 16) {
    return "credit card invalid error";
  } else if (Number(body.creditExpYear) === moment().year()) {
    if (Number(body.creditExpMonth) < moment().month() + 1) {
      //Block string text in the front end with input type
      return "expired credit";
    }
  } else if (Number(body.creditExpYear) <= moment().year()) {
    return "expired credit";
  }
  if (user) {
    // this will check to see if a user already is registered within our database and has an account. if so, we will push a user exists error BUT still place the order, we just wont make a new account or a new user entry in our db//
    const newOrderNumbers = {
      $push: { orderNumbers: orderNumber },
    };

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

    await db.collection("users").updateOne({ email }, newOrderNumbers);
    if (saveData === true) {
      await db.collection("users").updateOne({ email }, updatedValues);
    }

    return "user exists";
  }
  return "";
};

module.exports = { validation };
