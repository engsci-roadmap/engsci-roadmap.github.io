import { useState, useEffect } from "react";
import { CourseMetadata } from "../../types/resources";
import SemesterCourseCard from "./SemesterCourseCard";

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
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const semesterData = await import(
          `../../data/semesters/${semesterCode}.json`
        ); /* @vite-ignore */
        setCourses(semesterData.default);
      } catch (error) {
        console.error(`Failed to load courses for ${semesterCode}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
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
