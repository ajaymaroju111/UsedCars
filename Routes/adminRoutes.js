const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
router.use(cookieParser());

const {
  SetInactiveAccount,
} = require('../Controllers/adminAuth.js');

router.put('/deactivate', SetInactiveAccount);


module.exports = router;