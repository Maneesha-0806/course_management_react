const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require("../services/courseService");

const getCourses = (req, res) => {
    const courses = getAllCourses();
    res.status(200).json({ success: true, count: courses.length, data: courses });
};

const getCourse = (req, res) => {
    const course = getCourseById(req.params.id);
    if (!course) return res.status(404).json({ success: false, message: "Course not found" });
    res.status(200).json({ success: true, data: course });
};

const addCourse = (req, res) => {
    const newCourse = createCourse(req.body);
    res.status(201).json({ success: true, message: "Course created", data: newCourse });
};

const editCourse = (req, res) => {
    const updatedCourse = updateCourse(req.params.id, req.body);
    if (!updatedCourse) return res.status(404).json({ success: false, message: "Course not found" });
    res.status(200).json({ success: true, message: "Course updated", data: updatedCourse });
};

const removeCourse = (req, res) => {
    const deleted = deleteCourse(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Course not found" });
    res.status(200).json({ success: true, message: "Course deleted" });
};

module.exports = { getCourses, getCourse, addCourse, editCourse, removeCourse };