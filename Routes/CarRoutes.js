const express = require("express");
const router = express.Router();
const {
  GetAllCarsList,
  GetSpecificCarsById,
  uploadNewCar,
  UpdateCarUsingID,
  RemoveCarUsingID,
  SearchCarUsingDetails,
} = require("../Controllers/users/CarsAuth.js");
const {verifyUserUsingCookie} = require('../Middlewares/verifyUser.js')
const upload = require("../Middlewares/multer.js");
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
//using the cookie parser for the cookies :   
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const uploadMultiple = upload.array('images', 10); 

//using Routes for the cars : 
router.post('/', uploadMultiple, verifyUserUsingCookie, uploadNewCar);
router.get('/', GetAllCarsList);
router.get('/:id',verifyUserUsingCookie, GetSpecificCarsById);
router.put('/:id',verifyUserUsingCookie, UpdateCarUsingID);
router.delete('/:id',verifyUserUsingCookie, RemoveCarUsingID);
router.get('/filter', SearchCarUsingDetails);

module.exports = router;