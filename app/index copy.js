const express = require("express");
const bodyParser = require("body-parser");
const Redis = require("ioredis");

const app = express();
const port = 3000;
const redis = new Redis();

app.use(bodyParser.json());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Create a new item
app.post("/items", async (req, res, next) => {
  try {
    const { key, value } = req.body;
    await redis.set(key, value);
    res.status(201).send("Item created successfully");
  } catch (err) {
    next(err);
  }
});

// Read an item
app.get("/items/:key", async (req, res, next) => {
  try {
    const key = req.params.key;
    const value = await redis.get(key);

    if (value === null) {
      res.status(404).send("Item not found");
    } else {
      res.status(200).json({ key, value });
    }
  } catch (err) {
    next(err);
  }
});

// Update an item
app.put("/items/:key", async (req, res, next) => {
  try {
    const key = req.params.key;
    const value = req.body.value;
    await redis.set(key, value);
    res.status(200).send("Item updated successfully");
  } catch (err) {
    next(err);
  }
});

// Delete an item
app.delete("/items/:key", async (req, res, next) => {
  try {
    const key = req.params.key;
    await redis.del(key);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
