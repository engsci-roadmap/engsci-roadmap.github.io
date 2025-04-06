import { useState, useEffect } from "react";
import { CourseMetadata } from "../../types/resources";
import SemesterCourseCard from "./SemesterCourseCard";

// Import the semester data files directly
import Y1FData from "../../data/semesters/Y1F.json";
import Y1WData from "../../data/semesters/Y1W.json";
import Y2FData from "../../data/semesters/Y2F.json";
import Y2WData from "../../data/semesters/Y2W.json";

interface SemesterCourseGridProps {
  semesterCode: string;
  title: string;
}

const SemesterCourseGrid = ({
  semesterCode,
  title,
}: SemesterCourseGridProps) => {
  const [courses, setCourses] = useState<CourseMetadata[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);

    // Get data based on semesterCode
    let semesterData: CourseMetadata[] = [];
    switch (semesterCode.toUpperCase()) {
      case "Y1F":
        semesterData = Y1FData;
        break;
      case "Y1W":
        semesterData = Y1WData;
        break;
      case "Y2F":
        semesterData = Y2FData;
        break;
      case "Y2W":
        semesterData = Y2WData;
        break;
      default:
        console.error(`Unknown semester code: ${semesterCode}`);
    }

    setCourses(semesterData);
    setLoading(false);
  }, [semesterCode]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 animate-pulse"
            >
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{title}</h1>
      {courses.length === 0 ? (
        <p className="text-gray-600">No courses available for this semester.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <SemesterCourseCard
              key={course.code}
              course={course}
              semester={semesterCode.toLowerCase()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SemesterCourseGrid;
