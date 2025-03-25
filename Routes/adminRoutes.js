const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const {verifyUserUsingCookie} = require('../Middlewares/verifyUser.js');
const {
  setInactiveAccount,
  manageUsersPostCount,
  viewAllActiveAndInactiveUsers,
  createUseratAdminLevel,
  changeUserSubscriptionType,
  viewAllPostsOfaUserUsingId
} = require('../Controllers/admin/UsersOperations.js');

// const {restrictAdminUsers} = require('../Middlewares/restrictAdminUsers.js');
const {
  createCarOnAdminAccount,
    readCarDetailsUsingCarId,
    updateanyDetailsUsingCarId
} = require('../Controllers/admin/CarsOperations.js');

//user operation for admin  : 
router.route('/deactivate').get(verifyUserUsingCookie,setInactiveAccount);
router.route('/postlimit').put(verifyUserUsingCookie,manageUsersPostCount);
router.route('/overview' ).get(verifyUserUsingCookie, viewAllActiveAndInactiveUsers);
router.route('/changeplan').put(verifyUserUsingCookie,changeUserSubscriptionType);
router.route('/totalposts').get(verifyUserUsingCookie,viewAllPostsOfaUserUsingId);

//car operation as a admin : 
router.route('/createcar').post(verifyUserUsingCookie ,createCarOnAdminAccount );
router.route('/viewcar').get(verifyUserUsingCookie, readCarDetailsUsingCarId,);
router.route('/updatecarprice').put(verifyUserUsingCookie,updateanyDetailsUsingCarId);
module.exports = router;