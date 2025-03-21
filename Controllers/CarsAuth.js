const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const users = require("../Models/UserSchema.js");
dotenv.config();
const Cars = require("../Models/CarsSchema.js");

// Create a new car listing :
const UploadNewCar = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ error: "Token not found or expired, please login" });
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
  if (!decode) {
    return res.status(401).json({ error: "User authentication failed" });
  }
  const id = decode.id;
  if (!id) {
    return res.status(400).json({ error: "ID not found" });
  }
  const isUser = await users.findById(id);
  if (!isUser) {
    return res.status(404).json({ error: "User not found" });
  }
  if (!(isUser.status === "active")) {
    return res.status(401).json({ error: "User is inactive" });
  }
  if (isUser.number_of_uploads > process.env.POST_LIMIT) {
    console.log("upload limit exceeded, purchase any plan for further uploads");
    return res.status(402).json({
      message: "upload limit exceeded, purchase any plan for further uploads",
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
    // Extract file paths of uploaded images
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
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
      images: {
        name: req.file.originalname,
        img: {
          data: req.file.buffer, // Store buffer data
          contentType: req.file.mimetype,
        },
      },
      description,
      owner_id: isUser._id,
    });
    await cars.save();
    isUser.number_of_uploads += 1;
    await isUser.save();
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
    const carid = req.headers["authentication"];
    console.log(carid);
    const { token } = req.cookies;
    if (!carid) {
      return res.status(400).json({ error: "ID not found" });
    }
    if (!token) {
      return res.status(401).json({ TokenNotFound: "token not found" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ NotValid: "token is not valid" });
    }
    const id = decode.id;
    if (!id) {
      return res.status(401).json({ IdNotFound: "id not found in the token" });
    }
    const user = await users.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ UserNotFound: "User not found please register" });
    }
    if (!(user.status === "active")) {
      return res
        .status(401)
        .json({ message: "user is not active please verify the email" });
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
    const { token } = req.cookies;
    const { carid, newprice } = req.body;
    if (!carid || newprice) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (!token) {
      return res
        .status(401)
        .json({ error: "Token not found or expired, please login" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "User authentication failed" });
    }
    const id = decode.id;
    if (!id) {
      return res.status(401).json({
        message: "user ID can not fetched in cookie",
      });
    }
    const user = await users.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "No user Exist on this ID",
      });
    }
    if (!(user.status === "active")) {
      return res
        .status(401)
        .json({ error: "User is inactive please confirm your account" });
    }
    const car = await Cars.findById(carid);
    if (!car) {
      return res.status(404).json({ error: "No car found with this ID" });
    }
    if (user._id.toString() !== car.owner_id.toString()) {
      return res.status(401).json({
        message: "you are not authorized",
      });
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
    const { carid } = req.body;
    if (!carid) {
      return res.status(400).json({ error: "ID not found in the params" });
    }
    const { token } = req.cookies;
    if (!token) {
      return res
        .status(401)
        .json({ error: "Token not found or expired, please login" });
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "User authentication failed" });
    }
    const id = decode.id;
    if (!id) {
      return res.status(401).json({
        message: "user ID is not Fetched",
      });
    }

    const user = await users.findById(id);
    if (!user) {
      return res.status(400).json({
        message: "authentication failed please login again",
      });
    }
    if (!(user.status === "active")) {
      return res.status(401).json({ error: "User is inactive" });
    }

    const target = await Cars.findById(carid);
    if (!target) {
      return res.status(404).json({ error: "Car not found" });
    }
    if (!(user._id == target.owner_id)) {
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
      return res.status(404).json({ error: "No cars found matching the criteria" });
    }
    res.status(200).json({ cars });
  } catch (error) {
    console.log(error);
    res.status(500).json({ filterError: "Internal Server Error" });
  }
};

module.exports = {
  UploadNewCar,
  GetAllCarsList,
  GetSpecificCarsById,
  UpdateCarUsingID,
  RemoveCarUsingID,
  SearchCarUsingDetails,
};
