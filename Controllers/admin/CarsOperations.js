const Cars = require("../../Models/CarsSchema.js");
const catchAsync = require("../../Middlewares/catchAsync.js");

//create a car Using Car Details :
exports.createPost = catchAsync(async (req, res, next) => {
  try {
    
    if (!(req.user.account_type === "admin")) {
      return res.status(401).json({
        message: "you are not authorized for this operation",
      });
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
    // Prepare images for storage
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
    console.log("car created Successfully");
    return res.status(200).json({
      message: "car created Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status({
      error: `Inernal Server Error`,
    });
  }
});

//Read Car Details using car Id :
exports.getCatById = catchAsync(async (req, res, next) => {
  try {
    if (!(req.user.account_type === "admin")) {
      return res.status(401).json({
        message: "you are not authorized for this operation",
      });
    }
    const carId = req.headers["authentication"];
    if (!carId) {
      return res.status(401).json({
        message: "carId not Rceived",
      });
    }
    const carPost = await cars.findById(carId);
    if (!carPost) {
      return res.status(401).json({
        message: "No Posts are found on this ID",
      });
    }
    return res.status(200).json({
      carDetails: carPost,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

//updata a car using Car ID :
exports.updatePost = catchAsync(async (req, res, next) => {
  try {
    if (!(req.user.account_type === "admin")) {
      return res.status(401).json({
        message: "you are not authorized for this operation",
      });
    }
    const { carId, newprice } = req.body;
    if (!carId || newprice) {
      return res.status(401).json({
        message: "All fields are required",
      });
    }
    const carPost = await Cars.findById(carId);
    carPost.price = newprice;
    await carPost.save();
    console.log("car post updated successfully");
    return res.status(200).json({
      message: `car proce update successfully to : ${newprice}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});