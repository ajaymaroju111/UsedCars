const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const {VerifyUserUsingCookie} = require('../Middlewares/verifyUser.js');

const {
  SetInactiveAccount,
  manageUsersPostCount,
} = require('../Controllers/adminAuth.js');

router.put('/deactivate',VerifyUserUsingCookie,SetInactiveAccount);
router.put('/postlimit',VerifyUserUsingCookie,manageUsersPostCount);

module.exports = router;