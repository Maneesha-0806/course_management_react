const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");
const students = require("../data/students");

async function registerStudent({ name, email, password, department }) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingStudent = students.find((student) => student.email === normalizedEmail);
  
  if (existingStudent) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }
  
  const passwordHash = await bcrypt.hash(password, 12);
  const student = {
    id: randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    department: department.trim(),
    createdAt: new Date().toISOString(),
  };
  
  students.push(student);
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    department: student.department,
    createdAt: student.createdAt,
  };
}

async function loginStudent({ email, password }) {
  const normalizedEmail = email.trim().toLowerCase();
  const student = students.find((item) => item.email === normalizedEmail);
  
  if (!student) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  
  const passwordMatches = await bcrypt.compare(password, student.passwordHash);
  if (!passwordMatches) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }
  
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    department: student.department,
  };
}

module.exports = { registerStudent, loginStudent };