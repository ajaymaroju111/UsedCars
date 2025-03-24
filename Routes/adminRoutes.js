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
router.put('/deactivate',verifyUserUsingCookie,setInactiveAccount);
router.put('/postlimit',verifyUserUsingCookie,manageUsersPostCount);
router.get('/overview' , verifyUserUsingCookie, viewAllActiveAndInactiveUsers);
router.post('/createuser',verifyUserUsingCookie,createUseratAdminLevel);
router.put('/changeplan' ,verifyUserUsingCookie,changeUserSubscriptionType);
router.get('/totalposts' ,verifyUserUsingCookie,viewAllPostsOfaUserUsingId);

//car operation as a admin : 
router.post('/createcar', verifyUserUsingCookie ,createCarOnAdminAccount );
router.get('/viewcar', verifyUserUsingCookie, readCarDetailsUsingCarId,);
router.put('/updatecarprice', verifyUserUsingCookie,updateanyDetailsUsingCarId);
module.exports = router;