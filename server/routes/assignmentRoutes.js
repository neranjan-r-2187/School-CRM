const express = require('express');
const router = express.Router();
const { getAssignments, getAssignment } = require('../controllers/assignmentController');

router.get('/', getAssignments);
router.get('/:id', getAssignment);

module.exports = router;
