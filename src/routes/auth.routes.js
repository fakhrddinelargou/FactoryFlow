const express = require('express');
const { login } = require('../controllers/auth');
const router = express.Router();
const asyncHandler = require('../utils/AsyncHandler');
const validate = require('../middlewares/validate');
const { loginSchema } = require('../validations/user.zod');



router.post('/login',validate(loginSchema) ,  asyncHandler(login));


module.exports = router;