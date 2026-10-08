const express = require('express');
const { install ,getStatus } = require('../controllers/installation');
const router = express.Router();
const asyncHandler = require('../utils/AsyncHandler');

router.get('/status', asyncHandler(getStatus));
router.post('/', asyncHandler(install));

module.exports = router