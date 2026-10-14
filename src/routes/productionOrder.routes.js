const express = require('express');
const router = express.Router();
const { create , update , get} = require('../controllers/productionOrder');
const asyncHandler = require('../utils/AsyncHandler');
const  authenticate = require('../middlewares/authenticate')
const  authorize = require('../middlewares/authorize')
const {validateBody , validateQuery} = require('../middlewares/validate');
const { createOrderSchema , updateOrderSchema ,listOrdersQuerySchema } = require('../validations/order.zod');




router.post('/create', authenticate, authorize, validateBody(createOrderSchema), asyncHandler(create));
router.get('/', authenticate, authorize, validateQuery(listOrdersQuerySchema),asyncHandler(get));
router.patch('/update/:id', authenticate, authorize, validateBody(updateOrderSchema), asyncHandler(update));


module.exports = router