const express = require('express');
const router = express.Router();
const {create,me} = require('../controllers/user');
const  authenticate = require('../middlewares/authenticate')
const  authorize = require('../middlewares/authorize')
const asyncHandler = require('../utils/AsyncHandler')
const {userSchema} = require('../validations/user.zod');
const validate = require('../middlewares/validate');


router.post('/create' , authenticate , authorize ,  validate(userSchema) , asyncHandler(create));
router.get('/me', authenticate , asyncHandler(me));



module.exports = router;