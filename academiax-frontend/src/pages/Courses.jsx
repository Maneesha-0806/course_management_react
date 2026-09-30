import { useCourses } from "../context/CourseContext";
import CourseCard from "../components/CourseCard";
// import your Chakra UI layout components here like <Grid> or <Box>

function Courses() {
  // Destructure the values from our new context
  const { courses, loading, error } = useCourses();

  return (
    <div className="container mt-5">
      <h2>Course Catalog</h2>
      
      {/* Lecturer's conditional rendering patterns */}
      {loading && <p>Loading courses...</p>}
      {error && <p>{error}</p>}
      
      {!loading && !error && (
        <div className="row">
          {courses.map((course) => (
            <div className="col-md-4 mb-4" key={course.id}>
              <CourseCard
                image={course.image}
                alt={course.courseName}
                title={course.courseName}
                description={course.overview}
                courseKey={course.id}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Courses;