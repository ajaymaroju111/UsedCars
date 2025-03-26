const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const {verifyUser} = require('../Middlewares/verifyUser.js');
const {
  deactivateUser,
  setPostLimit,
  allUserTypes,
  userPlan,
  userPosts,
} = require('../Controllers/admin/UsersOperations.js');

// const {restrictAdminUsers} = require('../Middlewares/restrictAdminUsers.js');
const {
  createPost,
  getCatById,
  updatePost,
} = require('../Controllers/admin/CarsOperations.js');

//user operation for admin  : 
router.route('/deactivate').get(verifyUser,deactivateUser);
router.route('/postlimit').put(verifyUser,setPostLimit);
router.route('/overview' ).get(verifyUser, allUserTypes);
router.route('/changeplan').put(verifyUser,userPlan);
router.route('/totalposts').get(verifyUser,userPosts);

//car operation as a admin : 
router.route('/createcar').post(verifyUser ,createPost );
router.route('/viewcar').get(verifyUser, getCatById,);
router.route('/updatecarprice').put(verifyUser,updatePost);
module.exports = router;