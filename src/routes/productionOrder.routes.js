const express = require('express');
const router = express.Router();
const { create} = require('../controllers/productionOrder');
const asyncHandler = require('../utils/AsyncHandler');
const  authenticate = require('../middlewares/authenticate')
const  authorize = require('../middlewares/authorize')
const {validateBody} = require('../middlewares/validate');
const { createOrderSchema } = require('../validations/order.zod');




router.post('/create', authenticate, authorize, validateBody(createOrderSchema), asyncHandler(create));


module.exports = router