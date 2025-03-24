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

const {restrictAdminUsers} = require('../Middlewares/restrictAdminUsers.js');
const {
  createCarOnAdminAccount,
    readCarDetailsUsingCarId,
    updateanyDetailsUsingCarId
} = require('../Controllers/admin/CarsOperations.js');
//user operation for admin  : 
router.put('/deactivate',verifyUserUsingCookie,restrictAdminUsers,setInactiveAccount);
router.put('/postlimit',verifyUserUsingCookie,restrictAdminUsers,manageUsersPostCount);
router.get('/overview' , verifyUserUsingCookie,restrictAdminUsers, viewAllActiveAndInactiveUsers);
router.post('/createuser',verifyUserUsingCookie,restrictAdminUsers,createUseratAdminLevel);
router.put('/changeplan' ,verifyUserUsingCookie,restrictAdminUsers,changeUserSubscriptionType);
router.get('/totalposts' ,verifyUserUsingCookie,restrictAdminUsers,viewAllPostsOfaUserUsingId);

//car operation as a admin : 
router.post('/createcar', verifyUserUsingCookie,restrictAdminUsers ,createCarOnAdminAccount );
router.get('/viewcar', verifyUserUsingCookie,restrictAdminUsers, readCarDetailsUsingCarId,);
router.put('/updatecarprice', verifyUserUsingCookie,restrictAdminUsers,updateanyDetailsUsingCarId );
module.exports = router;