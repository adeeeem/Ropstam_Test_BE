const express = require("express");
const router = express.Router();
const Car = require("../models/Car");

router.post("/", async (req, res) => {
  try {
    const { name, model, color, image } = req.body;
    const car = new Car({ name, model, color, image });
    await car.save();
    res.status(201).json({ message: "Car created successfully", car });
  } catch (error) {
    console.error("Error creating car:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get all cars
router.get("/", async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    console.error("Error getting cars:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get a car by ID
router.get("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    res.status(200).json(car);
  } catch (error) {
    console.error("Error getting car by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a car by ID
router.put("/:id", async (req, res) => {
  try {
    const { name, model, color, image } = req.body;
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    car.name = name;
    car.model = model;
    car.color = color;
    car.image = image;
    await car.save();
    res.status(200).json({ message: "Car updated successfully", car });
  } catch (error) {
    console.error("Error updating car:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Delete a car by ID
router.delete("/:id", async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    await car.remove();
    res.status(200).json({ message: "Car deleted successfully" });
  } catch (error) {
    console.error("Error deleting car:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
