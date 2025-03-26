const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const catchAsync = require("../../Middlewares/catchAsync.js");
const ErrorHandler = require("../../utils/ErrorHandler.js");
dotenv.config();
const Cars = require("../../Models/CarsSchema.js");

// Create a new car listing :
exports.uploadpost = catchAsync(async (req, res, next) => {
  try {
    if (req.user.number_of_uploads >= req.user.post_limit) {
      return next(new ErrorHandler("your post limit has exceeded", 401));
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
    const carImages = req.files.map((file) => ({
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
      carImages: carImages, // Use the prepared images array
      description,
      owner_id: req.user._id,
    });
    // Save the car instance
    await cars.save();
    req.user.number_of_uploads += 1;
    await req.user.save();
    return res.status(201).json({ Success: "Car post added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ CarCreationTimeError: error.message });
  }
});

// Get the list of all cars :
exports.getAllPosts = catchAsync(async (req, res, next) => {
  const cars = await Cars.find();
  return res.status(200).json({ cars });
});

// Get a specific car details based on ID :
exports.getPostById = catchAsync(async (req, res, next) => {
  try {
    const carid = req.headers["authentication"];
    if (!carid) {
      return res.status(401).json({
        error: "car id not Found",
      });
    }
    const cars = await Cars.findById(carid);
    res.status(200).json({ cars });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Update a car by using car ID :
exports.updatePost = catchAsync(async (req, res, next) => {
  try {
    const { carId, newprice } = req.body;
    if (!carId || !newprice) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (isNaN(Number(newprice))) {
      return res.status(400).json({ error: "Invalid price value" });
    }
    const car = await Cars.findById(carId);
    if (!req.user._id.equals(car.owner_id)) {
      return next(new ErrorHandler("You are not Authorized", 401));
    }
    car.price = newprice;
    await car.save();
    res.status(200).json({
      Success : true,
      message : `car price updated successfully to : ${car.price}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

// Remove a car from the listing :
exports.deletePost = catchAsync(async (req, res, next) => {
  try {
    const carid = req.headers["authentication"];
    if (!carid) {
      return res.status(400).json({ error: "ID not found in the params" });
    }
    const car = await Cars.findById(carid);
    if (!(req.user._id == car.owner_id)) {
      return next(new ErrorHandler("You are not Authorized", 401));
    }
    await Cars.findByIdAndDelete(carid);
    return res.status(200).json({
      Success: true,
      message: "post Deleted Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
});

// Search car based on the brand, model, price, location :
exports.searchPost = catchAsync(async (req, res, next) => {
  if (req.query.keyword) {
    const cars = await Cars.find({
      $or: [
        { model: { $regex: req.query.keyword, $options: "i" } },
        { brand: { $regex: req.query.keyword, $options: "i" } },
        { location: { $regex: req.query.keyword, $options: "i" } },
      ],
    });
    if (!isNaN(Number(req.query.keyword))) {
      cars.push(...(await Cars.find({ price: Number(req.query.keyword) })));
    }
    res.status(200).json({
      Success: true,
      cars,
    });
  } else {
    return res.status(400).json({ error: "keyword is Required" });
  }
});
