const express = require('express');
const router = express.Router();
const { getClasses, getClass } = require('../controllers/classController');

router.get('/', getClasses);
router.get('/:id', getClass);

module.exports = router;
