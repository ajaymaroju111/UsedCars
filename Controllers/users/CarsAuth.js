const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const users = require("../../Models/UserSchema.js");
dotenv.config();
const Cars = require("../../Models/CarsSchema.js");

// Create a new car listing :
const uploadNewCar = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(404).json({ NoUserExist: "User not received" });
  }

  console.log(user.number_of_uploads, user.post_limit);
  if (user.number_of_uploads >= user.post_limit) {
    console.log("Upload limit exceeded, purchase any plan for further uploads");
    return res.status(402).json({
      message: "Upload limit exceeded, purchase any plan for further uploads",
    });
  }
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
      description,
    } = req.body;

    // Check for required fields
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
      !description
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    }

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }
    console.log(req.files);
    // Prepare images for storage
    const carImages = req.files.map(file => ({
      name: file.originalname,
      img: {
        data: file.buffer, // Store buffer data
        contentType: file.mimetype,
      },
    }));

    // Create a new car instance
    const cars = new Cars({
      brand,
      model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      condition,
      location,
      carImages : carImages, // Use the prepared images array
      description,
      owner_id: user._id,
    });

    // Save the car instance
    await cars.save();
    console.log(cars.carImages);

    // Update the user's number of uploads
    user.number_of_uploads += 1;
    await user.save();

    return res.status(201).json({ Success: "Car post added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ CarCreationTimeError: error.message });
  }
};


// Get the list of all cars :
const GetAllCarsList = async (req, res) => {
  try {
    const cars = await Cars.find();
    return res.status(200).json({ cars });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ DisplayCarsError: error.message });
  }
};

// Get a specific car details based on ID :
const GetSpecificCarsById = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ NoUserExist: "User not recieved" });
    }
    const carid = req.headers["authentication"];
    if (!carid) {
      return res.status(401).json({
        error: "car id not Found",
      });
    }
    const car = await Cars.findById(carid);
    if (!car) {
      return res
        .status(404)
        .json({ error: "No car found with the requested ID" });
    }
    res.status(200).json({ car });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a car by using car ID :

const UpdateCarUsingID = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ NoUserExist: "User not recieved" });
    }
    const { carId, newprice } = req.body;

    if (!carId || !newprice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(Number(newprice))) {
      return res.status(400).json({ error: "Invalid price value" });
    }

    const car = await Cars.findById(carId);
    if (!car) {
      return res.status(404).json({ error: "Data not Found" });
    }
    if (!user._id.equals(car.owner_id)) {
      return res.status(401).json({ message: "You are not authorized" });
    }
    car.price = newprice;
    await car.save();
    res.status(200).json({
      YourCar: car.brand,
      newprice: car.price,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// Remove a car from the listing :
const RemoveCarUsingID = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(404).json({ NoUserExist: "User not recieved" });
    }
    const carid = req.headers["authentication"];
    if (!carid) {
      return res.status(400).json({ error: "ID not found in the params" });
    }
    const car = await Cars.findById(carid);
    if (!car) {
      return res.status(404).json({ error: "Car not found" });
    }
    if (!(user._id == car.owner_id)) {
      return res.status(401).json({
        message: "you are not authorized",
      });
    }
    const toDelete = await Cars.findByIdAndDelete(carid);
    if (!toDelete) {
      return res.status(401).json({
        message: "Can't find a car on this ID",
      });
    }
    return res.status(200).json({ Success: "Car data deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// Search car based on the brand, model, price, location :
const SearchCarUsingDetails = async (req, res) => {
  const { brand, model, price, location } = req.headers;
  console.log(brand, model, price, location);
  try {
    let filters = {};
    // All the filters conditions : Case-insensitive search
    if (model) filters.model = { $regex: model, $options: "i" };
    if (brand) filters.brand = { $regex: brand, $options: "i" };
    if (location) filters.location = { $regex: location, $options: "i" };
    if (price) {
      const parsedPrice = Number(price);
      if (!isNaN(parsedPrice)) {
        filters.price = parsedPrice;
      } else {
        return res.status(400).json({ error: "Invalid price value" });
      }
    }
    const cars = await Cars.find(filters);
    if (cars.length === 0) {
      return res
        .status(404)
        .json({ error: "No cars found matching the criteria" });
    }
    res.status(200).json({ cars });
  } catch (error) {
    console.log(error);
    res.status(500).json({ filterError: "Internal Server Error" });
  }
};

module.exports = {
  uploadNewCar,
  GetAllCarsList,
  GetSpecificCarsById,
  UpdateCarUsingID,
  RemoveCarUsingID,
  SearchCarUsingDetails,
};
