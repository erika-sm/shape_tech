const assert = require("assert");
const { MongoClient } = require("mongodb");
const items = require("./data/items.json");
const companies = require("./data/companies.json");

require("dotenv").config();

const { MONGO_URI } = process.env;

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const batchImportItems = async () => {
  const client = new MongoClient(MONGO_URI, options);

  await client.connect();

  const db = client.db("shape_tech");

  const result = await db.collection("items").insertMany(items);
  assert.equal(items.length, result.insertedCount);
};

batchImportItems();
