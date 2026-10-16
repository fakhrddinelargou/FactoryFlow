const express = require('express');
const { login } = require('../controllers/auth');
const router = express.Router();
const asyncHandler = require('../utils/AsyncHandler');
const {validateBody} = require('../middlewares/validate');
const { loginSchema } = require('../validations/user.zod');



router.post('/login',validateBody(loginSchema) ,  asyncHandler(login));


module.exports = router;