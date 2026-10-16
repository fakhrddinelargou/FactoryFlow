const express = require('express');
const router = express.Router()
const asyncHandler = require('../utils/AsyncHandler');
const  authenticate = require('../middlewares/authenticate')
const  authorize = require('../middlewares/authorize');
const { list } = require('../controllers/stockMovment');
const {validateQuery} = require('../middlewares/validate');
const { listMovementsQuerySchema } = require('../validations/stockMovment.zod');

router.get('/', authenticate , authorize  , validateQuery(listMovementsQuerySchema) ,  asyncHandler(list));




module.exports = router;