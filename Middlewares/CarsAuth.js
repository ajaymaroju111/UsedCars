const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const carsDB = require("../Models/CarsSchema.js");
require("dotenv").config();
const multer = require("multer");
const upload = require("../Multer/multer.js");
const { array } = require("joi");

//Create a new car listing :
const CreateNewCarId = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ error: "token in not found or expired please login" });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "user Authentication failed " });
    }
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
    const imagePaths = req.files.map((file) => file.path);
    const cars = await carsDB.create({
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
      images: imagePaths,
      description,
    });
    await cars.save();
    return res.status(201).json({ Success: "Car created Succcesfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ CarCreationTimeError: error });
  }
};

//get the list of all cars list  :
const GetAllCarsList = async (req, res) => {
  try {
    //logic to fetch all te uses in te users :
    const cars = await carsDB.find();
    return res.status(201).json({ cars });
  } catch (error) {
    console.log(error);
    return res.json({ DisplayCarsError: error });
  }
};

//get a specific car details based on ID :
const GetSpecificCarsById = async (req, res) => {
  try {
    const id = req.headers.id;
    if (!id) {
      return res.status(400).json({ error: "id not found" });
    }
    const car = await carsDB.findOne({ id });
    if (!car) {
      return res.tus(404).json({ error: "no car found on the request" });
    }
    res.status(200).json({ car });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "internal server error" });
  }
};

//update a car by using car ID :
const UpdateCarUsingID = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res
      .status(401)
      .json({ error: "token in not found or expired please login" });
  }
  const { id } = req.params;
  if (!id) {
    res.status(401).json({ error: "id not found" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "user Authentication failed " });
    }
    const car = await carsDB.findById({ id });
    if (!car) {
      res.status(404).json({ error: "no car found on this ID" });
    }
    res.status(200).json({ YourCar: car });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

//remove a car from the listing :
const RemoveCarUsinfID = async (req, res) => {
  const { token } = req.headers;
  if (!token) {
    return res
      .status(401)
      .json({ error: "token in not found or expired please login" });
  }
  const  id  = req.params;
  if (!id) {
    res.status(400).json({ error: "id not found in the params" });
  }
  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode) {
      return res.status(401).json({ error: "user Authentication failed " });
    }
    const deleteCar = await carsDB.findByIdAndDelete({ id });
    if (!deleteCar) {
      return res.status(404).json({ error: "car not found" });
    }
    return res.status(200).json({ Sucess: "Car data deleted Sucessfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error });
  }
};

//search car based on the Brand , model , price , location :
const SearchCarUsingDetails = async (req, res) => {
  const { brand, model, price, location } = req.body;
  try {
    let filters = {};
    //all the filters conditions :    // Case-insensitive search
    if (model) filters.model = { $regex: model, $options: "i" };
    if (brand) filters.brand = { $regex: brand, $options: "i" };
    if (location) filters.location = { $regex: location, $options: "i" };
    if (price) filters.price = Number(price);
    const cars = await carsDB.find(filters);
    if (!cars) {
      res.status(404).json({ error: "cars cannot be get from the Database" });
    }
    res.status(200).json({ cars });
  } catch (error) {
    console.log(error);
    res.status(500).json({ filterError: error });
  }
};

module.exports = {
  GetAllCarsList,
  GetSpecificCarsById,
  CreateNewCarId : [upload.array('images', 10), CreateNewCarId],
  UpdateCarUsingID,
  RemoveCarUsinfID,
  SearchCarUsingDetails,
};