const express = require('express');
const router = express.Router();
const {
  getUsers,
  getTeachers,
  getStudents,
  createUser,
  createClass,
  updateClass,
  deleteClass,
  updateUser,
  deleteUser
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { ROLES } = require('../constants');

// All routes here are protected and restricted to Admin
router.use(protect);
router.use(authorize(ROLES.ADMIN, ROLES.SUPERADMIN));

router.route('/users')
  .get(getUsers)
  .post(createUser);

router.get('/teachers', getTeachers);
router.get('/students', getStudents);

router.route('/classes')
  .post(createClass);

router.route('/classes/:id')
  .put(updateClass)
  .delete(deleteClass);



router.route('/users/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
