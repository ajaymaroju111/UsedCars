const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());

const {
  SetInactiveAccount,
  DeleteanotherUserUsingId,
  
} = require('../Controllers/adminAuth.js');

router.put('/deactivate', SetInactiveAccount);
router.delete('/deleteuser', DeleteanotherUserUsingId);


module.exports = router;