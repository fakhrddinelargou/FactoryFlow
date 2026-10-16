const express = require('express');
const router = express.Router();
const { create , update , get , getOperaterOrders, getByOrderId,startOrder} = require('../controllers/productionOrder');
const asyncHandler = require('../utils/AsyncHandler');
const  authenticate = require('../middlewares/authenticate')
const  authorize = require('../middlewares/authorize')
const {validateBody , validateQuery} = require('../middlewares/validate');
const { createOrderSchema , updateOrderSchema,listOrdersQuerySchema ,getMineWithStatus} = require('../validations/order.zod');




router.get('/', authenticate, authorize, validateQuery(listOrdersQuerySchema),asyncHandler(get));
router.get('/mine', authenticate, validateQuery(getMineWithStatus) , asyncHandler(getOperaterOrders));
router.post('/create', authenticate, authorize, validateBody(createOrderSchema), asyncHandler(create));
router.get('/:id', authenticate,asyncHandler(getByOrderId));
router.post('/:id/start', authenticate, asyncHandler(startOrder));
router.patch('/update/:id', authenticate, authorize, validateBody(updateOrderSchema), asyncHandler(update));


module.exports = router

