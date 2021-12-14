var express = require("express");
var mongoClient = require("mongodb").MongoClient;
var objectId = require("mongodb").ObjectId;

var router = express.Router();

var dbPath = "mongodb://localhost:27017";

router.get("/api/books", async (req, res, next) => {
  const client = new mongoClient(dbPath);
  try {
    await client.connect();
    const database = client.db("TestDb");
    const collection = database.collection("Books");
    const curser = collection.find({});
    let item = [];
    await curser.forEach((doc) => {
      item.push(doc);
    });
    res.status(200).json(item);
  } catch (error) {
    console.log(`Error: ${error}`);
  } finally {
    await client.close();
  }
});

router.get("/api/books/:id", async (req, res, next) => {
  const id = req.params.id;
  const client = new mongoClient(dbPath);
  try {
    await client.connect();
    const database = client.db("TestDb");
    const collection = database.collection("Books");
    const doc = await collection.findOne({ _id: objectId(id) });
    console.log(doc);
    res.status(200).json(doc);
  } catch (error) {
    console.log(`Error: ${error}`);
    next(error);
  } finally {
    await client.close();
  }
});

router.post("/api/books", async (req, res, next) => {
  const book = req.body;
  const client = new mongoClient(dbPath);
  try {
    await client.connect();
    const database = client.db("TestDb");
    const collection = database.collection("Books");
    const result = await collection.insertOne(book);
    console.log(result);
    res.status(200).json(result);
  } catch (error) {
    console.log("Error: " + error);
    next(error);
  } finally {
    await client.close();
  }
});

router.put("/api/books", async (req, res, next) => {
  const id = req.body.id;
  console.log(id);
  const item = {
    title: req.body.title,
  };
  console.log(item);
  const client = new mongoClient(dbPath);
  try {
    await client.connect();
    const database = client.db("TestDb");
    const collection = database.collection("Books");
    const result = await collection.updateOne(
      { _id: objectId(id) },
      { $set: item }
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(`Error: ${error}`);
    next(error);
  } finally {
    await client.close();
  }
});

router.delete("/api/books", async (req, res, next) => {
  const client = new mongoClient(dbPath);
  const id = req.body.id;
  try {
    await client.connect();
    const database = client.db("TestDb");
    const collection = database.collection("Books");
    const result = await collection.deleteOne({ _id: objectId(id) });
    res.status(200).json(result);
  } catch (error) {
    console.log(`Error: ${error}`);
    next(error);
  } finally {
    await client.close();
  }
});

module.exports = router;
