const express = require("express");
const router = express.Router();

const ParkingLot = require("../models/Model");

exports.createParkingLot = async (req, res) => {
  try {
    const { name } = req.body;
    const existingParkingLot = await ParkingLot.findOne({ where: { name } });
    if (existingParkingLot) {
      return res
        .status(400)
        .json({ error: "Parking lot already exists with this name" });
    }

    const parkingLot = await ParkingLot.create({ name });
  } catch (error) {
    console.error("Error creating parking lot:", error);
    return res.status(500).json({ error: "Error creating parking lot" });
  }
};
// GET /parking/greet
router.get("/greet", (req, res) => {
  console.log("Inside greet");
  res.status(200).json("Hello, World!"); // Respond with your greeting message
});

// POST /parking/lot/dummy
router.post("/lot/dummy", (req, res) => {
  console.log("Inside createDummyParkingLot, dummyDto:", req.body);
  parkingHandler
    .createDummyParkingLot(req.body)
    .then((response) => {
      res.status(200).json(response); // Replace with the actual response from parkingHandler
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json("Error creating dummy parking lot");
    });
});

// POST /parking/lot
router.post("/lot", (req, res) => {
  console.log("Inside createParkingLot, parkingLotDto:", req.body);
  parkingHandler
    .createParkingLot(req.body)
    .then((response) => {
      res.status(201).json(response); // Replace with the actual response from parkingHandler
    })
    .catch((error) => {
      console.error("Error:", error);
      res.status(500).json("Error creating parking lot");
    });
});

// Implement other routes following a similar structure

module.exports = router;
