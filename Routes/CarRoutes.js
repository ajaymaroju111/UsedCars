const express = require("express");
const router = express.Router();
const {
  uploadpost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  searchPost,
} = require("../Controllers/users/CarsAuth.js");
const {verifyUser} = require('../Middlewares/verifyUser.js')
const upload = require("../Middlewares/multer.js");
router.use(express.json());
//using the cookie parser for the cookies :   
const cookieParser = require("cookie-parser");
router.use(cookieParser());
const uploadMultiple = upload.array('images', 10); 

//using Routes for the cars : 
router.route('/').post(uploadMultiple, verifyUser, uploadpost).get(getAllPosts);
router.route('/:id').get(verifyUser, getPostById).put(verifyUser, updatePost).delete(verifyUser, deletePost);
router.get('/filter', searchPost);
module.exports = router;