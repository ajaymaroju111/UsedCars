const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const {verifyUserUsingCookie} = require('../Middlewares/verifyUser.js');

const {
  setInactiveAccount,
  manageUsersPostCount,
  viewAllActiveAndInactiveUsers,
} = require('../Controllers/admin/adminAuth.js');

router.put('/deactivate',verifyUserUsingCookie,setInactiveAccount);
router.put('/postlimit',verifyUserUsingCookie,manageUsersPostCount);
router.get('/overview' , verifyUserUsingCookie, viewAllActiveAndInactiveUsers)

module.exports = router;