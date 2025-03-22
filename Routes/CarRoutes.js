const express = require("express");
const router = express.Router();
const {
  GetAllCarsList,
  GetSpecificCarsById,
  UploadNewCar,
  UpdateCarUsingID,
  RemoveCarUsingID,
  SearchCarUsingDetails,
} = require("../Controllers/CarsAuth.js");
const {VerifyUserUsingCookie} = require('../Middlewares/verifyUser.js')
const upload = require("../Middlewares/multer.js");
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
//using the cookie parser for the cookies :   
const cookieParser = require("cookie-parser");
router.use(cookieParser());

//using Routes for the cars : 
router.post('/', upload.single('image'),VerifyUserUsingCookie, UploadNewCar);
router.get('/', GetAllCarsList);
router.get('/:id',VerifyUserUsingCookie, GetSpecificCarsById);
router.put('/:id',VerifyUserUsingCookie, UpdateCarUsingID);
router.delete('/:id',VerifyUserUsingCookie, RemoveCarUsingID);
router.get('/filter', SearchCarUsingDetails);

module.exports = router;