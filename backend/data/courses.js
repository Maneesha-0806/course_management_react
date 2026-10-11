const courses = [
  {
    id: "fs202",
    title: "Full Stack Development",
    category: "Engineering",
    instructor: "Prof. Alan Turing",
    status: "Active",
    totalEnrolled: 142,
    description: "Learn to build modern web applications from frontend to backend.",
    modules: [{ id: "m1", title: "HTML & CSS Fundamentals", duration: "2 weeks" }]
  },
  {
    id: "ds301",
    title: "Data Structures",
    category: "Computer Science",
    instructor: "Dr. Grace Hopper",
    status: "Active",
    totalEnrolled: 89,
    description: "Master arrays, trees, graphs, and algorithmic complexity.",
    modules: []
  }
];

module.exports = courses;