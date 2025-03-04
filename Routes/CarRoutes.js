const express = require("express");
const router = express.Router();
const {
  GetAllCarsList,
  GetCarsById,
  CreateNewCarId,
  UpdateCarUsingID,
  RemoveCarUsinfID

} = require("../Middlewares/CarsAuth.js");
const upload = require("../Multer/multer.js");
//using the body parser for the json data : 
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
//using the cookie parser for the cookies :   
const cookieParser = require("cookie-parser");
router.use(cookieParser());


//using Routes for the cars : 
router.post('/',upload.array("images", 5),CreateNewCarId );
router.get('/' ,GetAllCarsList );
router.get('/:id' ,GetCarsById );
router.put('/:id' ,UpdateCarUsingID );
router.delete('/:id' ,RemoveCarUsinfID );
router.get('/search' ,RemoveCarUsinfID );


module.exports = router