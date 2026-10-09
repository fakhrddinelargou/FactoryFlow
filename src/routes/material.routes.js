const express = require('express');
const router = express.Router();
const { create, update, updateQuantity } = require('../controllers/material');
const asyncHandler = require('../utils/AsyncHandler');
const  authenticate = require('../middlewares/authenticate')
const  authorize = require('../middlewares/authorize')
const validate = require('../middlewares/validate');
const { createMaterialSchema , updateMaterialSchema ,stockEntrySchema } = require('../validations/material.zod');


router.post('/create', authenticate , authorize , validate(createMaterialSchema) ,  asyncHandler(create));
router.patch('/update/:id', authenticate , authorize , validate(updateMaterialSchema) ,  asyncHandler(update));
router.post('/:id', authenticate , authorize , validate(stockEntrySchema) ,  asyncHandler(updateQuantity));


module.exports = router;