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
} = require('../Controllers/admin/UsersOperations.js')

const {
  createCarOnAdminAccount,
    readCarDetailsUsingCarId,
    updateanyDetailsUsingCarId
} = require('../Controllers/admin/CarsOperations.js');
//user operation for admin  : 
router.put('/deactivate',verifyUserUsingCookie,setInactiveAccount);
router.put('/postlimit',verifyUserUsingCookie,manageUsersPostCount);
router.get('/overview' , verifyUserUsingCookie, viewAllActiveAndInactiveUsers);
router.post('/createuser' ,createUseratAdminLevel);
router.put('/changeplan' , changeUserSubscriptionType);
router.get('/totalposts' , viewAllPostsOfaUserUsingId);

//car operation as a admin : 
router.post('/createcar' ,createCarOnAdminAccount );
router.get('/viewcar' ,  readCarDetailsUsingCarId,);
router.put('/updatecarprice' ,updateanyDetailsUsingCarId );
module.exports = router;