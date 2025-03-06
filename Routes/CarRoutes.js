const express = require("express");
const router = express.Router();
const {
  GetAllCarsList,
  GetSpecificCarsById,
  CreateNewCarId,
  UpdateCarUsingID,
  RemoveCarUsingID
} = require("../Middlewares/CarsAuth.js");
const isAdminOrTenant = require("../Middlewares/AdminOrTenant/AdminOrTenant.js");
const upload = require("../Multer/multer.js");
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
//using the cookie parser for the cookies :   
const cookieParser = require("cookie-parser");
router.use(cookieParser());

//using Routes for the cars : 
router.post('/', isAdminOrTenant, upload.single('image'), CreateNewCarId);
router.get('/', GetAllCarsList);
router.get('/:id', GetSpecificCarsById);
router.put('/:id', isAdminOrTenant, UpdateCarUsingID);
router.delete('/:id', isAdminOrTenant, RemoveCarUsingID);

module.exports = router;