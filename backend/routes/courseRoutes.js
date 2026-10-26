const express = require("express");
const { getCourses, getCourse, addCourse, editCourse, removeCourse } = require("../controllers/courseController");
const validateCourse = require("../middleware/courseValidation");
const { authenticateToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", getCourses);
router.get("/:id", authenticateToken, getCourse);
router.post("/", authenticateToken, validateCourse, addCourse);
router.put("/:id", authenticateToken, editCourse);
router.delete("/:id", authenticateToken, removeCourse);

module.exports = router;