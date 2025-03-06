const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const carsDB = require("../Models/CarsSchema.js");

// Create a new car listing :
const CreateNewCarId = async (req, res) => {
  try {
    const {
      brand,
      model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      condition,
      location,
      sellerContact,
      description,
    } = req.body;
    if (
      !brand ||
      !model ||
      !year ||
      !price ||
      !mileage ||
      !fuelType ||
      !transmission ||
      !condition ||
      !location ||
      !sellerContact ||
      !description
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    }
    // Extract file paths of uploaded images
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const cars = new carsDB({
      brand,
      model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      condition,
      location,
      sellerContact,
      images: {
        name: req.file.originalname,
        img: {
          data: req.file.buffer, // Store buffer data
          contentType: req.file.mimetype,
        },
      },
      description,
    });
    await cars.save();
    return res.status(201).json({ Success: "Car created successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ CarCreationTimeError: error.message });
  }
};

// Get the list of all cars :
const GetAllCarsList = async (req, res) => {
  try {
    const cars = await carsDB.find();
    return res.status(200).json({ cars });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ DisplayCarsError: error.message });
  }
};

// Get a specific car details based on ID :
const GetSpecificCarsById = async (req, res) => {
  try {
    const id = req.headers.id;
    if (!id) {
      return res.status(400).json({ error: "ID not found" });
    }
    const car = await carsDB.findById(id);
    if (!car) {
      return res.status(404).json({ error: "No car found with the requested ID" });
    }
    res.status(200).json({ car });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a car by using car ID :
const UpdateCarUsingID = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ error: "Token not found or expired, please login" });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "ID not found" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "User authentication failed" });
    }
    const car = await carsDB.findById(id);
    if (!car) {
      return res.status(404).json({ error: "No car found with this ID" });
    }
    res.status(200).json({ YourCar: car });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Remove a car from the listing :
const RemoveCarUsingID = async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res
      .status(401)
      .json({ error: "Token not found or expired, please login" });
  }
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ error: "ID not found in the params" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "User authentication failed" });
    }
    const deleteCar = await carsDB.findByIdAndDelete(id);
    if (!deleteCar) {
      return res.status(404).json({ error: "Car not found" });
    }
    return res.status(200).json({ Success: "Car data deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// Search car based on the brand, model, price, location :
const SearchCarUsingDetails = async (req, res) => {
  const { brand, model, price, location } = req.body;
  try {
    let filters = {};
    // All the filters conditions : Case-insensitive search
    if (model) filters.model = { $regex: model, $options: "i" };
    if (brand) filters.brand = { $regex: brand, $options: "i" };
    if (location) filters.location = { $regex: location, $options: "i" };
    if (price) filters.price = Number(price);
    const cars = await carsDB.find(filters);
    if (!cars) {
      return res.status(404).json({ error: "Cars cannot be retrieved from the database" });
    }
    res.status(200).json({ cars });
  } catch (error) {
    console.log(error);
    res.status(500).json({ filterError: error.message });
  }
};

module.exports = {
  GetAllCarsList,
  GetSpecificCarsById,
  CreateNewCarId,
  UpdateCarUsingID,
  RemoveCarUsingID,
  SearchCarUsingDetails,
};