const express = require('express');
const router = express.Router();
const  authenticate = require('../middlewares/authenticate')
const  authorize = require('../middlewares/authorize')
const { create , update} = require('../controllers/product');
const asyncHandler = require('../utils/AsyncHandler');
const {validateBody} = require('../middlewares/validate');
const { createProductSchema , updateProductSchema } = require('../validations/product.zod');


router.post('/create' , authenticate ,authorize , validateBody(createProductSchema) , asyncHandler(create)  )
router.patch('/update/:id' , authenticate ,authorize , validateBody(updateProductSchema) , asyncHandler(update)  )



module.exports = router