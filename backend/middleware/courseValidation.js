const validateCourse = (req, res, next) => {
    const { title, instructor, category, description } = req.body;
    
    if (!title) return res.status(400).json({ success: false, message: "Title is required" });
    if (!instructor) return res.status(400).json({ success: false, message: "Instructor is required" });
    if (!category) return res.status(400).json({ success: false, message: "Category is required" });
    if (!description) return res.status(400).json({ success: false, message: "Description is required" });
    
    next();
};
module.exports = validateCourse;