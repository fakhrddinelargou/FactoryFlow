const express = require('express');
const router = express.Router();
const { install ,getStatus } = require('../controllers/installation');
const asyncHandler = require('../utils/AsyncHandler');
const validate = require('../middlewares/validate');
const { userSchema } = require('../validations/user.zod');

router.get('/status', asyncHandler(getStatus));
router.post('/', validate(userSchema) ,  asyncHandler(install));

module.exports = router