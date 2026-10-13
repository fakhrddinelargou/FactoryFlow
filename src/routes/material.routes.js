const express = require('express');
const router = express.Router();
const { create, update, updateQuantity, getAllMaterials ,getOneMaterial , findMaterialsBelowThreshold } = require('../controllers/material');
const asyncHandler = require('../utils/AsyncHandler');
const  authenticate = require('../middlewares/authenticate')
const  authorize = require('../middlewares/authorize')
const {validateBody} = require('../middlewares/validate');
const { createMaterialSchema , updateMaterialSchema ,stockEntrySchema } = require('../validations/material.zod');


router.post('/create', authenticate , authorize , validateBody(createMaterialSchema) ,  asyncHandler(create));
router.get('/', authenticate , authorize  ,  asyncHandler(getAllMaterials));
router.get('/alerts', authenticate , authorize  ,  asyncHandler(findMaterialsBelowThreshold));
router.patch('/update/:id', authenticate , authorize , validateBody(updateMaterialSchema) ,  asyncHandler(update));
router.post('/:id/stock-entries', authenticate , authorize , validateBody(stockEntrySchema) ,  asyncHandler(updateQuantity));
router.get('/:id', authenticate , authorize  ,  asyncHandler(getOneMaterial));


module.exports = router;