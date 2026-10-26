const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const notFound = require("./middleware/notFoundMiddleware");
const errorHandler = require("./middleware/errorMiddleware");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => {
    res.json({
        message: "Student Course Management API is running"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, message: "Backend is healthy", timestamp: new Date().toISOString() });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);

app.use(notFound); 
app.use(errorHandler); 

// Force a new port to bypass Windows/Antivirus silent terminations
const PORT = 5005;

const server = app.listen(PORT, () => {
    console.log(`✅ Server successfully running on http://localhost:${PORT}`);
});

// Catch any hidden network errors
server.on("error", (error) => {
    console.error("❌ Fatal Server Error:", error);
});

// Force the Node.js event loop to stay awake
setInterval(() => {}, 1000 * 60 * 60);