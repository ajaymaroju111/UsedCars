const express = require("express");
const router = express.Router();
const {
  GetAllCarsList,
  GetSpecificCarsById,
  CreateNewCarId,
  UpdateCarUsingID,
  RemoveCarUsinfID

} = require("../Middlewares/CarsAuth.js");
const isAdminOrTenant = require("../Middlewares/AdminOrTenant/AdminOrTenant.js");
//using the multer for the image uploading :
const upload = require("../Multer/multer.js");
//using the body parser for the json data : 
router.use(express.json());
router.use(express.urlencoded({ extended: false }));
//using the cookie parser for the cookies :   
const cookieParser = require("cookie-parser");
router.use(cookieParser());


//using Routes for the cars : 
router.post('/',isAdminOrTenant,upload.single('image'),CreateNewCarId );
router.get('/' ,GetAllCarsList );
router.get('/:id' ,GetSpecificCarsById );
router.put('/:id',isAdminOrTenant ,UpdateCarUsingID );
router.delete('/:id',isAdminOrTenant ,RemoveCarUsinfID );
router.get('/search' ,RemoveCarUsinfID );


module.exports = router